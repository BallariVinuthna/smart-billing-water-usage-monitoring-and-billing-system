import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaTrash, FaUserPlus, FaHome } from 'react-icons/fa';

const ManageUsers = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [assignmentData, setAssignmentData] = useState({ buildingId: '', apartmentId: '' });

    const fetchUsers = async () => {
        try {
            if (user && user.token) {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users', config);
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const fetchBuildings = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/buildings', config);
            setBuildings(data);
        } catch (error) {
            console.error("Error fetching buildings", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchBuildings();
    }, [user]);

    const handleBuildingChange = async (buildingId) => {
        setAssignmentData({ ...assignmentData, buildingId, apartmentId: '' });
        if (buildingId) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/apartments', config);
                // Filter apartments by building
                setApartments(data.filter(a => a.building?._id === buildingId || a.building === buildingId));
            } catch (error) {
                console.error("Error fetching apartments", error);
            }
        } else {
            setApartments([]);
        }
    };

    const handleAssign = async () => {
        if (!assignmentData.apartmentId) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, {
                assignedApartment: assignmentData.apartmentId
            }, config);

            alert('Resident assigned successfully!');
            setShowAssignModal(false);
            fetchUsers();
        } catch (error) {
            alert('Error assigning resident');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/users/${id}`, config);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    return (
        <Layout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
                <button
                    disabled
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition opacity-50 cursor-not-allowed"
                >
                    <FaUserPlus className="inline mr-2" />
                    Add User (Coming Soon)
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apartment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(u => (
                            <tr key={u._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {u.assignedApartment ? (
                                        <span className="text-green-600 font-medium">Apt {u.assignedApartment.apartmentNumber || 'Assigned'}</span>
                                    ) : (
                                        <span className="text-red-400 italic">Not Assigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    {u.role === 'resident' && (
                                        <button
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setShowAssignModal(true);
                                                setAssignmentData({ buildingId: u.assignedApartment?.building || '', apartmentId: u.assignedApartment?._id || '' });
                                            }}
                                            className="text-primary hover:text-sky-700"
                                            title="Assign Apartment"
                                        >
                                            <FaHome />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(u._id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete User"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-primary">Assign Apartment to {selectedUser?.name}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Select Building</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={assignmentData.buildingId}
                                    onChange={(e) => handleBuildingChange(e.target.value)}
                                >
                                    <option value="">-- Choose Building --</option>
                                    {buildings.map(b => (
                                        <option key={b._id} value={b._id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Select Apartment</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    disabled={!assignmentData.buildingId}
                                    value={assignmentData.apartmentId}
                                    onChange={(e) => setAssignmentData({ ...assignmentData, apartmentId: e.target.value })}
                                >
                                    <option value="">-- Choose Apartment --</option>
                                    {apartments.map(a => (
                                        <option key={a._id} value={a._id}>{a.apartmentNumber} (Floor {a.floor?.floorNumber})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssign}
                                    disabled={!assignmentData.apartmentId}
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-sky-600 disabled:opacity-50"
                                >
                                    Assign Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};
export default ManageUsers;
