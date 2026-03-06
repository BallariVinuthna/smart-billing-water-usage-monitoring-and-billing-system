import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['leakage', 'high_usage', 'abnormal', 'other'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    message: { type: String, required: true },
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building'
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'ignored'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
