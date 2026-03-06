import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    month: { type: String, required: true }, // Format: "MM-YYYY"
    year: { type: Number, required: true },

    previousReading: { type: Number, required: true },
    currentReading: { type: Number, required: true },
    unitsConsumed: { type: Number, required: true },

    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    generatedDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    paidDate: { type: Date },
});

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
