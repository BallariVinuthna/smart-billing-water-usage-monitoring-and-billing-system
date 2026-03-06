import mongoose from 'mongoose';

const meterReadingSchema = new mongoose.Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    readingValue: { type: Number, required: true }, // Current reading in Liters or Units
    readingDate: { type: Date, default: Date.now },
    source: {
        type: String,
        enum: ['manual', 'iot', 'simulated'],
        default: 'manual'
    },
    isAbnormal: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const MeterReading = mongoose.model('MeterReading', meterReadingSchema);
export default MeterReading;
