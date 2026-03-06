import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const ResidentAlerts = () => {
    const { user } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                if (user && user.token) {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    // Currently fetch alerts by user is placeholder. 
                    // But if we had /api/alerts/user endpoint working correctly it would be great.
                    // For now let's try calling it.
                    const { data } = await axios.get(`http://localhost:5000/api/alerts/user`, config);
                    setAlerts(data);
                }
            } catch (error) {
                console.error("Error fetching alerts", error);
            }
        };
        fetchAlerts();
    }, [user]);

    const getIcon = (type) => {
        switch (type) {
            case 'leakage': return <FaExclamationTriangle className="text-red-500" />;
            case 'high_usage': return <FaInfoCircle className="text-yellow-500" />;
            default: return <FaCheckCircle className="text-blue-500" />;
        }
    };

    return (
        <Layout role="resident">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Alerts</h1>
            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div key={alert._id} className="bg-white p-4 rounded-lg shadow flex items-start space-x-4">
                        <div className="mt-1 text-xl">{getIcon(alert.type)}</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800 capitalize">{alert.type.replace('_', ' ')} Alert</h3>
                            <p className="text-gray-600">{alert.message}</p>
                            <span className="text-xs text-gray-400">{new Date(alert.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {alert.status}
                            </span>
                        </div>
                    </div>
                ))}
                {alerts.length === 0 && <div className="text-center text-gray-500">No alerts found.</div>}
            </div>
        </Layout>
    );
};

export default ResidentAlerts;
