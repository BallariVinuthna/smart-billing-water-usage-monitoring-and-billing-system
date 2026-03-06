import MeterReading from '../models/MeterReading.js';
import Apartment from '../models/Apartment.js';

// @desc    Add a new meter reading
// @route   POST /api/readings
// @access  Private/Manager
export const addReading = async (req, res) => {
    try {
        const { apartment, building, readingValue, readingDate, source } = req.body;

        // Check if reading exists for this date (basic duplicate check, optional)
        // For now, allow multiple readings but typically we'd restrict one per day.

        const reading = new MeterReading({
            apartment,
            building,
            readingValue,
            readingDate: readingDate || Date.now(),
            source,
        });

        const createdReading = await reading.save();
        res.status(201).json(createdReading);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get readings by apartment ID
// @route   GET /api/readings/apartment/:apartmentId
// @access  Private
export const getApartmentReadings = async (req, res) => {
    console.log(`[Meter] Fetching readings for apartment: ${req.params.apartmentId}`);
    try {
        const readings = await MeterReading.find({ apartment: req.params.apartmentId }).sort({ readingDate: -1 });
        console.log(`[Meter] Found ${readings.length} readings.`);
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get readings by building ID
// @route   GET /api/readings/building/:buildingId
// @access  Private/Manager
export const getReadingsByBuilding = async (req, res) => {
    try {
        const readings = await MeterReading.find({ building: req.params.buildingId })
            .populate('apartment', 'apartmentNumber')
            .sort({ readingDate: -1 });
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Simulate auto-readings for all apartments
// @route   POST /api/readings/simulate
// @access  Private/Admin
export const simulateReadings = async (req, res) => {
    try {
        const apartments = await Apartment.find({});
        const readings = [];

        for (const apt of apartments) {
            // Get last reading to increment
            const lastReading = await MeterReading.findOne({ apartment: apt._id }).sort({ readingDate: -1 });
            const previousValue = lastReading ? lastReading.readingValue : 1000; // start at 1000 if no reading

            const increment = Math.floor(Math.random() * 50) + 10; // Random usage between 10-60 units
            const newValue = previousValue + increment;

            const reading = new MeterReading({
                apartment: apt._id,
                building: apt.building,
                readingValue: newValue,
                source: 'simulated',
            });

            await reading.save();
            readings.push(reading);
        }

        res.json({ message: `Simulated ${readings.length} readings`, readings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
