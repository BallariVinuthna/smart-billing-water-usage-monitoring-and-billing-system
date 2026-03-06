import Layout from '../components/Layout';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';

const MonthlyBill = () => {
    const { user } = useContext(AuthContext);
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);

    const fetchBills = async () => {
        console.log("MonthlyBill: Fetching bills...");
        try {
            console.log("User Context:", user);
            if (user && user.assignedApartment) {
                console.log("Fetching for Apt ID:", user.assignedApartment);
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/billing/apartment/${user.assignedApartment}`, config);
                console.log("Bills Fetched:", data);
                setBills(data);
            } else {
                console.warn("User or AssignedApartment missing", user);
            }
        } catch (error) {
            console.error("Error fetching bills", error);
        }
    };

    useEffect(() => {
        fetchBills();
    }, [user]);

    const handlePayClick = (bill) => {
        setSelectedBill(bill);
    };

    const handlePaymentSuccess = () => {
        setSelectedBill(null);
        fetchBills(); // Refresh to show paid status
        alert('Payment Successful!');
    };

    return (
        <Layout role="resident">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Monthly Bills</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units (L)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bills.map((bill) => (
                            <tr key={bill._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(bill.generatedDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.unitsConsumed}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{bill.totalAmount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                                        bill.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {bill.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {bill.status !== 'paid' && (
                                        <button
                                            onClick={() => handlePayClick(bill)}
                                            className="text-indigo-600 hover:text-indigo-900 font-bold"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                    {bill.status === 'paid' && <span className="text-gray-400">Paid</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bills.length === 0 && <div className="p-6 text-center text-gray-500">No bills found.</div>}
            </div>

            {selectedBill && (
                <PaymentModal
                    bill={selectedBill}
                    onClose={() => setSelectedBill(null)}
                    onPaymentSuccess={handlePaymentSuccess}
                    token={user.token}
                />
            )}
        </Layout>
    );
};

export default MonthlyBill;
