import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema({
    floorNumber: { type: Number, required: true },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
});

// A building cannot have duplicate floor numbers
floorSchema.index({ building: 1, floorNumber: 1 }, { unique: true });

const Floor = mongoose.model('Floor', floorSchema);
export default Floor;
