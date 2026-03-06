import Layout from '../components/Layout';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ResidentDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        usage: 0,
        unpaid: 0,
        trend: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            console.log('ResidentDashboard: User State:', user);
            if (user?.assignedApartment && user.token) {
                console.log('Fetching data for Apt:', user.assignedApartment);
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };

                    // 1. Get Bills
                    const billsRes = await axios.get(`http://localhost:5000/api/billing/apartment/${user.assignedApartment}`, config);
                    const unpaidTotal = billsRes.data
                        .filter(b => b.status === 'pending')
                        .reduce((acc, curr) => acc + curr.totalAmount, 0);

                    // 2. Get Readings
                    const readingsRes = await axios.get(`http://localhost:5000/api/readings/apartment/${user.assignedApartment}`, config);
                    const readings = readingsRes.data;

                    let usage = 0;
                    // Sort descending
                    const sorted = readings.sort((a, b) => new Date(b.readingDate) - new Date(a.readingDate));
                    if (sorted.length > 1) {
                        const latest = sorted[0].readingValue;
                        // Find reading ~30 days ago
                        const monthAgo = sorted.find(r => new Date(r.readingDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
                        const prev = monthAgo ? monthAgo.readingValue : sorted[sorted.length - 1].readingValue;
                        usage = latest - prev;
                    }

                    // Chart data (last 7 days small sparkline)
                    const chartData = sorted.slice(0, 7).reverse().map(r => ({ val: r.readingValue }));

                    setStats({
                        usage,
                        unpaid: unpaidTotal,
                        trend: chartData
                    });

                } catch (error) {
                    console.error("Dashboard Fetch Error", error);
                }
            }
        };
        fetchDashboardData();
    }, [user]);

    if (!user?.assignedApartment) {
        return (
            <Layout role="resident">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded shadow-md text-center">
                    <p className="text-xl font-bold text-yellow-800 mb-2">Awaiting Apartment Assignment</p>
                    <p className="text-yellow-700">Your account is active, but you haven't been assigned to an apartment yet. Please contact your Building Manager to get started.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout role="resident">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-primary">
                    <h3 className="text-gray-500 uppercase text-sm">Last 30 Days Usage</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.usage} <span className="text-lg font-normal text-gray-500">Liters</span></p>
                    <p className="text-sm text-green-500 mt-1">Updated just now</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-accent">
                    <h3 className="text-gray-500 uppercase text-sm">Unpaid Bill</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">₹{stats.unpaid.toLocaleString()}</p>
                    {stats.unpaid > 0 ? (
                        <button
                            onClick={() => navigate('/resident/monthly-bill')}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-sky-600 transition"
                        >
                            Pay Now
                        </button>
                    ) : (
                        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded cursor-default">All Paid</button>
                    )}
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Quick Usage Trend</h3>
                    <button onClick={() => navigate('/resident/usage-history')} className="text-blue-500 text-sm hover:underline">View Full History</button>
                </div>
                <div className="h-48 rounded flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200">
                    {stats.trend.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.trend}>
                                <Line type="monotone" dataKey="val" stroke="#8884d8" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 font-medium italic">No usage data recorded yet</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};
export default ResidentDashboard;
