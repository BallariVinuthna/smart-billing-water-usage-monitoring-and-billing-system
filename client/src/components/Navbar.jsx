import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-primary">
                            WaterSmart
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <FaUserCircle className="text-xl" />
                                    <span className="font-semibold">{user.name} ({user.role})</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                                    title="Logout"
                                >
                                    <FaSignOutAlt className="text-xl" />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="font-medium text-gray-500 hover:text-primary">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
