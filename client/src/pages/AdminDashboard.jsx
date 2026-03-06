import Layout from '../components/Layout';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBuildings: 0,
        totalRevenue: 0,
        userDistribution: []
    });

    // Modal state for registering a new manager
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [formMsg, setFormMsg] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            if (user && user.token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get('http://localhost:5000/api/reports/admin-stats', config);
                    setStats(data);
                } catch (error) {
                    console.error("Error fetching admin stats", error);
                }
            }
        };
        fetchStats();
    }, [user]);

    const handleRegisterManager = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormMsg('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/users', { ...formData, role: 'manager' }, config);
            setFormMsg('✅ Manager registered successfully!');
            setFormData({ name: '', email: '', password: '' });
            // Refresh stats
            const { data } = await axios.get('http://localhost:5000/api/reports/admin-stats', config);
            setStats(data);
            setTimeout(() => { setShowModal(false); setFormMsg(''); }, 1500);
        } catch (error) {
            setFormMsg('❌ ' + (error.response?.data?.message || 'Error creating manager'));
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Layout role="admin">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-primary">
                    <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-accent">
                    <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">Buildings Managed</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBuildings}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}</p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-700">User Distribution</h2>
                    {stats.userDistribution.length > 0 ? (
                        <div className="space-y-4">
                            {stats.userDistribution.map((item) => (
                                <div key={item._id} className="flex items-center justify-between">
                                    <span className="capitalize text-gray-600 font-medium">{item._id}s</span>
                                    <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm font-bold">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No user data available.</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-700">Quick Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => { setShowModal(true); setFormMsg(''); }}
                            className="w-full bg-blue-50 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-100 transition text-left"
                        >
                            + Register New Manager
                        </button>
                        <button
                            onClick={() => navigate('/admin/buildings')}
                            className="w-full bg-teal-50 text-teal-600 py-3 px-4 rounded-lg font-semibold hover:bg-teal-100 transition text-left"
                        >
                            + Add New Building
                        </button>
                    </div>
                </div>
            </div>

            {/* Register Manager Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Register New Manager</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleRegisterManager} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="manager@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Set a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            {formMsg && (
                                <p className={`text-sm font-medium ${formMsg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                                    {formMsg}
                                </p>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                                >
                                    {formLoading ? 'Registering...' : 'Register Manager'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminDashboard;
