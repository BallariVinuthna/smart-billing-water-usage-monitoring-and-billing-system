import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalUsage: 0,
        totalRevenue: 0,
        pendingBills: 0
    });
    const [recentAlerts, setRecentAlerts] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/reports/dashboard', config);
                setDashboardData(data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        const fetchAlerts = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/alerts', config);
                setRecentAlerts(data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching alerts", error);
            }
        };

        if (user && user.token) {
            fetchStats();
            fetchAlerts();
        }
    }, [user]);

    return (
        <Layout role="manager">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Manager Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">Total Usage (Liters)</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardData.totalUsage}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">Revenue Collected</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">₹{dashboardData.totalRevenue ? dashboardData.totalRevenue.toLocaleString() : 0}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider">Pending Bills</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">{dashboardData.pendingBills}</p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/manager/meter-readings')}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            <span>📊</span> Add New Reading
                        </button>
                        <button
                            onClick={() => navigate('/manager/billing')}
                            className="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition flex items-center justify-center gap-2"
                        >
                            <span>🧾</span> Generate Monthly Bills
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Alerts</h3>
                    {recentAlerts.length > 0 ? (
                        <div className="space-y-3">
                            {recentAlerts.map(alert => (
                                <div key={alert._id} className={`p-3 rounded-lg text-sm ${alert.severity === 'high' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                    <p className="font-semibold capitalize">{alert.type.replace('_', ' ')}</p>
                                    <p className="text-xs mt-1 opacity-80">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No active alerts.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ManagerDashboard;
