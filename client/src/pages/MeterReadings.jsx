import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const MeterReadings = () => {
    const { user } = useContext(AuthContext);
    const [readings, setReadings] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [formData, setFormData] = useState({
        apartment: '',
        building: '',
        readingValue: '',
        readingDate: new Date().toISOString().split('T')[0],
        source: 'manual'
    });
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchData = async () => {
        try {
            if (user && user.token) {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // 1. Fetch buildings
                const bRes = await axios.get('http://localhost:5000/api/buildings', config);
                setBuildings(bRes.data);

                if (bRes.data.length > 0) {
                    const bId = selectedBuilding || bRes.data[0]._id;
                    if (!selectedBuilding) setSelectedBuilding(bId);

                    // 2. Fetch readings for the selected building
                    const rRes = await axios.get(`http://localhost:5000/api/readings/building/${bId}`, config);
                    setReadings(rRes.data);

                    // 3. Fetch all apartments and filter by selected building
                    const aRes = await axios.get('http://localhost:5000/api/apartments', config);
                    setApartments(aRes.data.filter(a => (a.building?._id || a.building) === bId));

                    setFormData(prev => ({ ...prev, building: bId }));
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user, selectedBuilding]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.apartment) {
            setMessage({ text: 'Please select an apartment.', type: 'error' });
            return;
        }
        if (!formData.readingValue || Number(formData.readingValue) <= 0) {
            setMessage({ text: 'Please enter a valid meter reading value.', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/readings', {
                apartment: formData.apartment,
                building: formData.building,
                readingValue: Number(formData.readingValue),
                readingDate: formData.readingDate,
                source: formData.source
            }, config);
            setMessage({ text: '✅ Reading added successfully!', type: 'success' });
            setFormData(prev => ({ ...prev, apartment: '', readingValue: '', readingDate: new Date().toISOString().split('T')[0] }));
            setShowForm(false);
            fetchData(); // Refresh list
        } catch (err) {
            setMessage({ text: '❌ ' + (err.response?.data?.message || 'Error adding reading'), type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout role="manager">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Meter Readings</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Building:</span>
                        <select
                            value={selectedBuilding}
                            onChange={(e) => setSelectedBuilding(e.target.value)}
                            className="text-sm border-none bg-gray-100 rounded px-2 py-1 font-bold text-gray-700 focus:ring-2 focus:ring-blue-400"
                        >
                            {buildings.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setMessage({ text: '', type: '' }); }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto text-center"
                >
                    {showForm ? '✕ Close Form' : '+ Add New Reading'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-4 p-3 rounded-lg font-medium text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                    <h2 className="text-xl font-bold mb-5 text-gray-700">Add Manual Reading</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apartment *</label>
                            <select
                                required
                                value={formData.apartment}
                                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">-- Select Apartment --</option>
                                {apartments.map(apt => (
                                    <option key={apt._id} value={apt._id}>
                                        Apt {apt.apartmentNumber} {apt.building?.name ? `(${apt.building.name})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Reading (Liters) *</label>
                            <input
                                type="number"
                                required
                                placeholder="e.g. 1850"
                                min="0"
                                value={formData.readingValue}
                                onChange={(e) => setFormData({ ...formData, readingValue: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.readingDate}
                                onChange={(e) => setFormData({ ...formData, readingDate: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                            <select
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="manual">Manual Entry</option>
                                <option value="iot">IoT Sensor</option>
                                <option value="simulated">Simulated</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                            >
                                {loading ? 'Saving...' : 'Save Reading'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Reading History</h2>
                {readings.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No readings recorded yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apartment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reading (L)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {readings.slice(0, 30).map(r => (
                                    <tr key={r._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(r.readingDate).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Apt {r.apartment?.apartmentNumber || '—'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{r.readingValue.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize 
                                                ${r.source === 'iot' ? 'bg-blue-100 text-blue-700' :
                                                    r.source === 'manual' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-600'}`}>
                                                {r.source}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MeterReadings;
