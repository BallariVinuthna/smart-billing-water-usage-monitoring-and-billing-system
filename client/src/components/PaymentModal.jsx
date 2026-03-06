import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

// Replace with your text publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bill, onSuccess, onClose, token }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        try {
            // 1. Get Client Secret
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data: { clientSecret } } = await axios.post(
                'http://localhost:5000/api/billing/create-payment-intent',
                { billId: bill._id },
                config
            );

            // 2. Confirm Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: 'Resident', // Could fetch user name
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 3. Update Backend Status
                    await axios.post(`http://localhost:5000/api/billing/pay/${bill._id}`, {}, config);
                    onSuccess();
                }
            }
        } catch (err) {
            console.error('Payment Error:', err);
            setError(err.response?.data?.message || err.message);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 border rounded">
                <CardElement />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
                {!stripe ? 'Stripe Loading...' : processing ? 'Processing...' : `Pay ₹${bill.totalAmount.toLocaleString()}`}
            </button>
        </form>
    );
};

const PaymentModal = ({ bill, onClose, onPaymentSuccess, token }) => {
    if (!bill) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-4">Secure Payment</h2>
                <p className="mb-4 text-gray-600">Paying for bill: <span className="font-semibold">{bill._id.slice(-6)}</span></p>

                <Elements stripe={stripePromise}>
                    <CheckoutForm bill={bill} onSuccess={onPaymentSuccess} onClose={onClose} token={token} />
                </Elements>
            </div>
        </div>
    );
};

export default PaymentModal;
