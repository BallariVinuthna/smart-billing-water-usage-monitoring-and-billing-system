import Floor from '../models/Floor.js';

// @desc    Create a new floor
// @route   POST /api/floors
// @access  Private/Admin/Manager
export const createFloor = async (req, res) => {
    try {
        const { floorNumber, building } = req.body;
        const floor = new Floor({
            floorNumber,
            building,
        });

        const createdFloor = await floor.save();
        res.status(201).json(createdFloor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get floors by building ID
// @route   GET /api/floors/:buildingId
// @access  Private
export const getFloorsByBuilding = async (req, res) => {
    try {
        const floors = await Floor.find({ building: req.params.buildingId }).sort({ floorNumber: 1 });
        res.json(floors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete floor
// @route   DELETE /api/floors/:id
// @access  Private/Admin
export const deleteFloor = async (req, res) => {
    try {
        const floor = await Floor.findById(req.params.id);

        if (floor) {
            await floor.deleteOne();
            res.json({ message: 'Floor removed' });
        } else {
            res.status(404).json({ message: 'Floor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
