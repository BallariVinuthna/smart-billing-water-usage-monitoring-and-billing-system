import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('resident');
    const [error, setError] = useState('');

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'manager') navigate('/manager/dashboard');
            else navigate('/resident/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(name, email, password, role);
        if (!res.success) {
            setError(res.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-primary">Register</h2>
                {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Role</label>
                        <select
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="resident">Resident</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white transition rounded bg-primary hover:bg-sky-600"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p>Already have an account? <Link to="/login" className="text-secondary hover:text-primary">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
