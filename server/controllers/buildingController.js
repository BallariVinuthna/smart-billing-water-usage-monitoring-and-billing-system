import Building from '../models/Building.js';

// @desc    Create a new building
// @route   POST /api/buildings
// @access  Private/Admin
export const createBuilding = async (req, res) => {
    try {
        const { name, address, totalFloors, manager } = req.body;
        const building = new Building({
            name,
            address,
            totalFloors,
            manager,
        });

        const createdBuilding = await building.save();
        res.status(201).json(createdBuilding);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all buildings
// @route   GET /api/buildings
// @access  Private
export const getBuildings = async (req, res) => {
    try {
        const buildings = await Building.find({}).populate('manager', 'name email');
        res.json(buildings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get building by ID
// @route   GET /api/buildings/:id
// @access  Private
export const getBuildingById = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id).populate('manager', 'name email');

        if (building) {
            res.json(building);
        } else {
            res.status(404).json({ message: 'Building not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update building
// @route   PUT /api/buildings/:id
// @access  Private/Admin
export const updateBuilding = async (req, res) => {
    try {
        const { name, address, totalFloors, manager } = req.body;
        const building = await Building.findById(req.params.id);

        if (building) {
            building.name = name || building.name;
            building.address = address || building.address;
            building.totalFloors = totalFloors || building.totalFloors;
            building.manager = manager || building.manager;

            const updatedBuilding = await building.save();
            res.json(updatedBuilding);
        } else {
            res.status(404).json({ message: 'Building not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete building
// @route   DELETE /api/buildings/:id
// @access  Private/Admin
export const deleteBuilding = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);

        if (building) {
            await building.deleteOne();
            res.json({ message: 'Building removed' });
        } else {
            res.status(404).json({ message: 'Building not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
