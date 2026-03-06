import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Bill from './models/Bill.js';
import Alert from './models/Alert.js';
import MeterReading from './models/MeterReading.js';
import connectDB from './config/db.js';

dotenv.config();

const checkData = async () => {
    try {
        await connectDB();

        const resident = await User.findOne({ email: 'resident1@example.com' });
        console.log('Resident:', resident ? `Found (ID: ${resident._id}, Apt: ${resident.assignedApartment})` : 'Not Found');

        if (resident && resident.assignedApartment) {
            const bills = await Bill.find({ apartment: resident.assignedApartment });
            console.log(`Bills for Resident: ${bills.length}`);
            bills.forEach(b => console.log(` - Bill: ${b.month}-${b.year}, Status: ${b.status}, Amount: ${b.totalAmount}`));

            const alerts = await Alert.find({ apartment: resident.assignedApartment });
            console.log(`Alerts for Resident: ${alerts.length}`);
            alerts.forEach(a => console.log(` - Alert: ${a.type}, ${a.message}`));

            const readings = await MeterReading.find({ apartment: resident.assignedApartment });
            console.log(`Readings for Resident: ${readings.length}`);
        } else {
            console.log('Resident has no assigned apartment?');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
