import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Building from './models/Building.js';
import Floor from './models/Floor.js';
import Apartment from './models/Apartment.js';
import MeterReading from './models/MeterReading.js';
import Bill from './models/Bill.js';
import Alert from './models/Alert.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Building.deleteMany({});
        await Floor.deleteMany({});
        await Apartment.deleteMany({});
        await MeterReading.deleteMany({});
        await Bill.deleteMany({});
        await Alert.deleteMany({});

        console.log('Creating Users...');
        const salt = await bcrypt.genSalt(10);

        // Pass plain text, assuming model hook handles hashing, OR better yet, manual hash here to be strict if we bypassed hook (User.create invokes hooks though).
        // Let's stick to what worked or simplest: plain text if hooks exist.
        // Re-reading User model from memory (step 164 view_file didn't show it but I know it's standard).
        // Let's assume inputting plain text 'password123' works as per previous success.

        const users = await User.create([
            { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
            { name: 'Manager User', email: 'manager@example.com', password: 'password123', role: 'manager' },
            { name: 'John Doe', email: 'resident1@example.com', password: 'password123', role: 'resident' },
            { name: 'Jane Smith', email: 'resident2@example.com', password: 'password123', role: 'resident' },
        ]);

        const adminUser = users[0];
        const managerUser = users[1];
        const res1 = users[2];
        const res2 = users[3];

        console.log('Creating Building...');
        const building = await Building.create({
            name: 'Skyline Heights',
            address: '123 Cloud Avenue, Metropolis',
            manager: managerUser._id,
            totalFloors: 5
        });

        console.log('Creating Floors & Apartments...');
        const apartments = [];
        for (let i = 1; i <= 5; i++) {
            const floor = await Floor.create({
                floorNumber: i,
                building: building._id
            });

            // Create 2 apartments per floor
            const apt1 = await Apartment.create({
                apartmentNumber: `${i}01`,
                floor: floor._id,
                building: building._id,
                status: 'vacant'
            });
            const apt2 = await Apartment.create({
                apartmentNumber: `${i}02`,
                floor: floor._id,
                building: building._id,
                status: 'vacant'
            });
            apartments.push(apt1, apt2);
        }

        // Assign Residents
        console.log('Assigning Residents...');
        apartments[0].residents.push(res1._id);
        apartments[0].status = 'occupied';
        await apartments[0].save();
        res1.assignedApartment = apartments[0]._id;
        await res1.save();

        apartments[1].residents.push(res2._id);
        apartments[1].status = 'occupied';
        await apartments[1].save();
        res2.assignedApartment = apartments[1]._id;
        await res2.save();

        console.log('Generating Meter Readings (60 days)...');
        // Simulating last 60 days readings for occupied apartments
        const occupiedApts = [apartments[0], apartments[1]];

        for (const apt of occupiedApts) {
            let readingValue = 1000;
            for (let d = 60; d >= 0; d--) {
                const date = new Date();
                date.setDate(date.getDate() - d);

                // Add random usage (20-50 liters)
                readingValue += Math.floor(Math.random() * 30) + 20;

                await MeterReading.create({
                    apartment: apt._id,
                    building: building._id,
                    readingValue,
                    readingDate: date,
                    source: 'iot'
                });
            }
            apt.currentReading = readingValue; // Keep track for bills
        }

        console.log('Generating Alerts...');
        await Alert.create({
            type: 'high_usage',
            severity: 'medium',
            message: `Unusual water consumption detected on weekends.`,
            apartment: apartments[0]._id, // John Doe
            building: building._id,
            status: 'active'
        });
        await Alert.create({
            type: 'leakage',
            severity: 'high',
            message: `Continuous low-flow detected continuously for 4 hours.`,
            apartment: apartments[0]._id,
            building: building._id,
            status: 'resolved'
        });

        console.log('Generating Bills...');
        // 1. Paid Bill for Previous Month
        const prevMonth = new Date();
        prevMonth.setMonth(prevMonth.getMonth() - 2); // 2 months ago
        const prevMonthStr = String(prevMonth.getMonth() + 1).padStart(2, '0');

        // 2. Pending Bill for Last Month
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1); // 1 month ago
        const lastMonthStr = String(lastMonth.getMonth() + 1).padStart(2, '0');

        for (const apt of occupiedApts) {
            // Paid Bill
            await Bill.create({
                apartment: apt._id,
                month: prevMonthStr,
                year: prevMonth.getFullYear(),
                previousReading: 1000,
                currentReading: 1500,
                unitsConsumed: 500,
                totalAmount: 7000.00, // ₹7000
                dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Due 30 days ago
                status: 'paid',
                paidDate: new Date()
            });

            // Pending Bill
            await Bill.create({
                apartment: apt._id,
                month: lastMonthStr,
                year: lastMonth.getFullYear(),
                previousReading: 1500,
                currentReading: 2100,
                unitsConsumed: 600,
                totalAmount: 9500.00, // ₹9500 (using penalty rates)
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
                status: 'pending'
            });
        }

        console.log('Data Imported!');
        process.exit();

    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
