import Apartment from '../models/Apartment.js';

// @desc    Get all apartments
// @route   GET /api/apartments
// @access  Private
export const getApartments = async (req, res) => {
    try {
        const apartments = await Apartment.find({}).populate('building floor');
        res.json(apartments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new apartment
// @route   POST /api/apartments
// @access  Private/Admin/Manager
export const createApartment = async (req, res) => {
    try {
        const { apartmentNumber, floor, building, status } = req.body;
        const apartment = new Apartment({
            apartmentNumber,
            floor,
            building,
            status,
        });

        const createdApartment = await apartment.save();
        res.status(201).json(createdApartment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get apartments by floor ID
// @route   GET /api/apartments/:floorId
// @access  Private
export const getApartmentsByFloor = async (req, res) => {
    try {
        const apartments = await Apartment.find({ floor: req.params.floorId }).populate('residents', 'name email');
        res.json(apartments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get apartments by resident (user) ID
// @route   GET /api/apartments/user/:userId
// @access  Private
export const getApartmentsByUser = async (req, res) => {
    try {
        const apartments = await Apartment.find({ residents: req.params.userId }).populate('building floor');
        res.json(apartments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update apartment (e.g. assign resident)
// @route   PUT /api/apartments/:id
// @access  Private/Manager
export const updateApartment = async (req, res) => {
    try {
        const { residents, status } = req.body;
        const apartment = await Apartment.findById(req.params.id);

        if (apartment) {
            apartment.residents = residents || apartment.residents;
            apartment.status = status || apartment.status;

            const updatedApartment = await apartment.save();
            res.json(updatedApartment);
        } else {
            res.status(404).json({ message: 'Apartment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete apartment
// @route   DELETE /api/apartments/:id
// @access  Private/Admin
export const deleteApartment = async (req, res) => {
    try {
        const apartment = await Apartment.findById(req.params.id);

        if (apartment) {
            await apartment.deleteOne();
            res.json({ message: 'Apartment removed' });
        } else {
            res.status(404).json({ message: 'Apartment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
