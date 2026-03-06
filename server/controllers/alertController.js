import Alert from '../models/Alert.js';

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private/Manager/System
export const createAlert = async (req, res) => {
    try {
        const { type, severity, message, apartment, building } = req.body;
        const alert = new Alert({
            type,
            severity,
            message,
            apartment,
            building,
        });

        const createdAlert = await alert.save();
        res.status(201).json(createdAlert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get alerts by user (resident)
// @route   GET /api/alerts/user
// @access  Private
export const getAlertsByUser = async (req, res) => {
    try {
        // req.user is set by auth middleware
        if (!req.user || !req.user.assignedApartment) {
            return res.status(400).json({ message: 'User not assigned to an apartment' });
        }

        const alerts = await Alert.find({
            apartment: req.user.assignedApartment,
            status: 'active'
        }).sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get alerts by building
// @route   GET /api/alerts/building/:buildingId
// @access  Private/Manager
export const getAlertsByBuilding = async (req, res) => {
    try {
        const alerts = await Alert.find({ building: req.params.buildingId }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/resolve/:id
// @access  Private/Manager
export const resolveAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (alert) {
            alert.status = 'resolved';
            alert.resolvedAt = Date.now();
            const updatedAlert = await alert.save();
            res.json(updatedAlert);
        } else {
            res.status(404).json({ message: 'Alert not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
