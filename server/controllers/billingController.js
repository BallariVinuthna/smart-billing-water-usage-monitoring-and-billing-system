import Bill from '../models/Bill.js';
import MeterReading from '../models/MeterReading.js';
import Apartment from '../models/Apartment.js';
import Stripe from 'stripe';
import 'dotenv/config'; // Load env vars immediately

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper to calculate bill amount based on INR slab logic
const calculateAmount = (units) => {
    let amount = 0;
    // INR Slab Logic (Realistic for India)
    if (units <= 100) {
        amount = units * 10; // ₹10/unit for first 100
    } else if (units <= 500) {
        amount = (100 * 10) + ((units - 100) * 15); // ₹15/unit for 101-500
    } else {
        amount = (100 * 10) + (400 * 15) + ((units - 500) * 25); // ₹25/unit for 500+ (penalty)
    }
    return Math.max(amount, 0);
};

// @desc    Generate Bill for an apartment
// @route   POST /api/billing/generate
// @access  Private/Manager
export const generateBill = async (req, res) => {
    const { apartmentId, month, year } = req.body; // month: "01-2024", year: 2024

    try {
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' });

        // Find current month's latest reading
        // Usually readingDate matches month/year
        // For simplicity, find reading closest to end of month? 
        // Or just find LATEST reading overall and Previous Bill's reading? 

        // Approach: Find latest reading of THIS month
        const startDate = new Date(year, parseInt(month.split('-')[0]) - 1, 1);
        const endDate = new Date(year, parseInt(month.split('-')[0]), 0); // Last day of month

        const currentReadingDoc = await MeterReading.findOne({
            apartment: apartmentId,
            readingDate: { $gte: startDate, $lt: endDate } // Should be expanded to cover full day
        }).sort({ readingDate: -1 });

        if (!currentReadingDoc) {
            return res.status(400).json({ message: 'No meter reading found for this month' });
        }

        // Find previous bill to get previous reading
        const lastBill = await Bill.findOne({ apartment: apartmentId }).sort({ generatedDate: -1 });

        let previousReading = 0;
        if (lastBill) {
            previousReading = lastBill.currentReading;
        } else {
            // If no previous bill, find first reading ever or 0
            const firstReading = await MeterReading.findOne({ apartment: apartmentId }).sort({ readingDate: 1 });
            previousReading = firstReading ? (firstReading.readingValue > currentReadingDoc.readingValue ? 0 : firstReading.readingValue) : 0;
            // Edge case handling simplified
        }

        const unitsConsumed = currentReadingDoc.readingValue - previousReading;
        if (unitsConsumed < 0) {
            // Reset case or error
            return res.status(400).json({ message: 'Current reading is less than previous reading. Check meter.' });
        }

        const totalAmount = calculateAmount(unitsConsumed);

        const bill = new Bill({
            apartment: apartmentId,
            month,
            year: parseInt(year),
            previousReading,
            currentReading: currentReadingDoc.readingValue,
            unitsConsumed,
            totalAmount,
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days due
        });

        const createdBill = await bill.save();
        res.status(201).json(createdBill);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Bills for ALL apartments (Batch)
// @route   POST /api/billing/generate-all
// @access  Private/Manager
export const generateAllBills = async (req, res) => {
    const { month, year } = req.body;
    try {
        const apartments = await Apartment.find({ status: 'occupied' });
        const generatedCount = [];
        const errors = [];

        for (const apt of apartments) {
            try {
                console.log(`[DEBUG] Processing Apt ${apt.apartmentNumber} (${apt._id})`);
                // Check if bill already exists for this month/year/apt
                const existingBill = await Bill.findOne({ apartment: apt._id, month, year });
                if (existingBill) {
                    console.log(`[DEBUG] Bill already exists for Apt ${apt.apartmentNumber}`);
                    continue;
                }

                // Find latest reading of this month
                const startDate = new Date(year, parseInt(month.split('-')[0]) - 1, 1);
                const endDate = new Date(year, parseInt(month.split('-')[0]), 0);
                endDate.setHours(23, 59, 59, 999);

                console.log(`[DEBUG] Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

                const currentReadingDoc = await MeterReading.findOne({
                    apartment: apt._id,
                    readingDate: { $gte: startDate, $lte: endDate }
                }).sort({ readingDate: -1 });

                if (!currentReadingDoc) {
                    console.log(`[DEBUG] No reading found for Apt ${apt.apartmentNumber}`);
                    continue;
                }

                console.log(`[DEBUG] Found reading: ${currentReadingDoc.readingValue} on ${currentReadingDoc.readingDate}`);

                const lastBill = await Bill.findOne({ apartment: apt._id }).sort({ generatedDate: -1 });
                let previousReading = lastBill ? lastBill.currentReading : 1000;

                console.log(`[DEBUG] Previous Reading: ${previousReading}`);

                const unitsConsumed = currentReadingDoc.readingValue - previousReading;
                if (unitsConsumed < 0) {
                    console.log(`[DEBUG] Negative consumption for Apt ${apt.apartmentNumber}: ${unitsConsumed}`);
                    continue;
                }

                console.log(`[DEBUG] Units Consumed: ${unitsConsumed}`);

                const totalAmount = calculateAmount(unitsConsumed);

                const bill = new Bill({
                    apartment: apt._id,
                    month,
                    year: parseInt(year),
                    previousReading,
                    currentReading: currentReadingDoc.readingValue,
                    unitsConsumed,
                    totalAmount,
                    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                });

                await bill.save();
                console.log(`[DEBUG] Bill saved for Apt ${apt.apartmentNumber}`);
                generatedCount.push(apt.apartmentNumber);
            } catch (err) {
                console.log(`[DEBUG] Error for Apt ${apt.apartmentNumber}: ${err.message}`);
                errors.push({ apt: apt.apartmentNumber, error: err.message });
            }
        }

        res.status(200).json({
            message: `Successfully generated ${generatedCount.length} bills.`,
            generated: generatedCount,
            errors
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bills for an apartment
// @route   GET /api/billing/apartment/:apartmentId
// @access  Private
export const getApartmentBills = async (req, res) => {
    console.log(`[Billing] Fetching bills for apartment: ${req.params.apartmentId}`);
    try {
        const bills = await Bill.find({ apartment: req.params.apartmentId }).sort({ year: -1, month: -1 });
        console.log(`[Billing] Found ${bills.length} bills.`);
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending bills
// @route   GET /api/billing/pending
// @access  Private
export const getPendingBills = async (req, res) => {
    try {
        const bills = await Bill.find({ status: 'pending' }).populate('apartment');
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pay a bill
// @route   PUT /api/billing/pay/:id
// @access  Private
export const payBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);

        if (bill) {
            bill.status = 'paid';
            bill.paidDate = Date.now();
            const updatedBill = await bill.save();
            res.json(updatedBill);
        } else {
            res.status(404).json({ message: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Payment Intent
// @route   POST /api/billing/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
    try {
        const { billId } = req.body;
        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Create a PaymentIntent with the order amount and currency (INR)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(bill.totalAmount * 100), // Amount in paise
            currency: 'inr',
            description: `Water bill for apartment ${bill.apartment} - ${bill.month}/${bill.year}`,
            metadata: { billId: bill._id.toString() }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
