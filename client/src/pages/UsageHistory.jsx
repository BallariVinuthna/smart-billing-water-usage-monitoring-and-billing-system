import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const UsageHistory = () => {
    const { user } = useContext(AuthContext);
    const [readings, setReadings] = useState([]);

    useEffect(() => {
        const fetchReadings = async () => {
            try {
                if (user && user.assignedApartment) {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`http://localhost:5000/api/readings/apartment/${user.assignedApartment}`, config);
                    // Transform for chart
                    const chartData = data.map(r => ({
                        date: new Date(r.readingDate).toLocaleDateString('en-GB').replace(/\//g, '-'),
                        value: r.readingValue
                    })).reverse(); // Show oldest to newest
                    setReadings(chartData);
                }
            } catch (error) {
                console.error("Error fetching readings", error);
            }
        };
        fetchReadings();
    }, [user]);

    return (
        <Layout role="resident">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Water Usage History</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Consumption Trend</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={readings}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="Meter Reading (L)" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Readings Log</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reading (Liters)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {readings.slice().reverse().map((r, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IoT</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default UsageHistory;
