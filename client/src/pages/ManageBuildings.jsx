import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaBuilding, FaPlus } from 'react-icons/fa';

const ManageBuildings = () => {
    const { user } = useContext(AuthContext);
    const [buildings, setBuildings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', totalFloors: 5 });

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                if (user && user.token) {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get('http://localhost:5000/api/buildings', config);
                    setBuildings(data);
                }
            } catch (error) {
                console.error("Error fetching buildings", error);
            }
        };
        fetchBuildings();
    }, [user, showForm]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/buildings', formData, config);
            setShowForm(false);
            setFormData({ name: '', address: '', totalFloors: 5 });
            alert('Building Created Successfully');
        } catch (error) {
            alert('Error creating building');
        }
    };

    return (
        <Layout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Buildings</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-accent text-white px-4 py-2 rounded hover:bg-teal-600 transition"
                >
                    <FaPlus className="inline mr-2" />
                    Add Building
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-bold mb-4">New Building</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Floors</label>
                            <input
                                type="number"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                                value={formData.totalFloors}
                                onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save Building</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildings.map(b => (
                    <div key={b._id} className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                        <FaBuilding className="text-4xl text-gray-400" />
                        <div>
                            <h3 className="text-xl font-bold">{b.name}</h3>
                            <p className="text-gray-600">{b.address}</p>
                            <p className="text-sm text-gray-400">{b.totalFloors} Floors</p>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};
export default ManageBuildings;
