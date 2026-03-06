import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalFloors: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Building = mongoose.model('Building', buildingSchema);
export default Building;
