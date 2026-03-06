import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema({
    apartmentNumber: { type: String, required: true },
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor',
        required: true
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    residents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['occupied', 'vacant'],
        default: 'vacant'
    },
    createdAt: { type: Date, default: Date.now },
});

const Apartment = mongoose.model('Apartment', apartmentSchema);
export default Apartment;
