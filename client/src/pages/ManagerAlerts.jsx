import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const ManagerAlerts = () => {
    const { user } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                if (user && user.token) {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    // For manager, fetch "building" alerts.
                    // Endpoint: /api/alerts/building/:buildingId
                    // Need building ID. Assuming first building again.
                    const bRes = await axios.get('http://localhost:5000/api/buildings', config);
                    if (bRes.data.length > 0) {
                        const buildingId = bRes.data[0]._id;
                        const aRes = await axios.get(`http://localhost:5000/api/alerts/building/${buildingId}`, config);
                        setAlerts(aRes.data);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAlerts();
    }, [user]);

    const resolveAlert = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/alerts/resolve/${id}`, {}, config);
            // Refresh
            const newAlerts = alerts.map(a => a._id === id ? { ...a, status: 'resolved' } : a);
            setAlerts(newAlerts);
        } catch (e) { alert(e.message); }
    }

    return (
        <Layout role="manager">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Building Alerts</h1>
            <div className="space-y-4">
                {alerts.map(alert => (
                    <div key={alert._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-red-600 uppercase">{alert.type} Alert</h3>
                            <p className="text-gray-800">{alert.message}</p>
                            <p className="text-sm text-gray-500">Apartment: {alert.apartment?.apartmentNumber} • Reported: {new Date(alert.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            {alert.status === 'active' ? (
                                <button
                                    onClick={() => resolveAlert(alert._id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Mark Resolved
                                </button>
                            ) : (
                                <span className="text-green-600 font-bold border border-green-600 px-3 py-1 rounded">Resolved</span>
                            )}
                        </div>
                    </div>
                ))}
                {alerts.length === 0 && <div className="text-center text-gray-500">No active alerts.</div>}
            </div>
        </Layout>
    );
};

export default ManagerAlerts;
