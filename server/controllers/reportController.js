import Bill from '../models/Bill.js';
import MeterReading from '../models/MeterReading.js';
import User from '../models/User.js';
import Building from '../models/Building.js';
import Apartment from '../models/Apartment.js';

// @desc    Get dashboard summary stats
// @route   GET /api/reports/dashboard
// @access  Private/Admin/Manager
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsage = await MeterReading.aggregate([
            { $group: { _id: null, total: { $sum: "$readingValue" } } }
        ]);

        const totalRevenue = await Bill.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const pendingBills = await Bill.countDocuments({ status: 'pending' });

        res.json({
            totalUsage: totalUsage[0]?.total || 0,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingBills
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Admin Stats
// @route   GET /api/reports/admin-stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBuildings = await Building.countDocuments();
        const totalApartments = await Apartment.countDocuments();

        const totalRevenue = await Bill.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const userDistribution = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            totalBuildings,
            totalApartments,
            totalRevenue: totalRevenue[0]?.total || 0,
            userDistribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
