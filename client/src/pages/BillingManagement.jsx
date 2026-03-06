import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const BillingManagement = () => {
    const { user } = useContext(AuthContext);
    const [pendingBills, setPendingBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [billForm, setBillForm] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    const fetchBills = async () => {
        try {
            if (user && user.token) {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/billing/pending', config);
                setPendingBills(data);
            }
        } catch (error) {
            console.error("Error fetching bills", error);
        }
    };

    useEffect(() => {
        fetchBills();
    }, [user]);

    const handleGenerateBills = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const monthStr = billForm.month.toString().padStart(2, '0');
            const { data } = await axios.post('http://localhost:5000/api/billing/generate-all', {
                month: monthStr,
                year: billForm.year.toString()
            }, config);

            setMessage(`✅ ${data.message}`);
            setShowModal(false);
            fetchBills(); // Refresh list
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Error generating bills'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout role="manager">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Billing Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Generate Monthly Bills
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Pending Payments</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apartment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingBills.map((bill) => (
                                <tr key={bill._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Apt {bill.apartment?.apartmentNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(bill.generatedDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₹{bill.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 capitalize">
                                            {bill.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pendingBills.length === 0 && (
                    <div className="p-8 text-center text-gray-500 font-medium">
                        No pending bills found. Click above to generate them!
                    </div>
                )}
            </div>

            {/* Bill Generation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Generate Monthly Bills</h2>
                        <form onSubmit={handleGenerateBills} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={billForm.month}
                                    onChange={(e) => setBillForm({ ...billForm, month: e.target.value })}
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={billForm.year}
                                    onChange={(e) => setBillForm({ ...billForm, year: e.target.value })}
                                >
                                    {[2024, 2025, 2026].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Generating...' : 'Generate Now'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-bold hover:bg-gray-200"
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

export default BillingManagement;
