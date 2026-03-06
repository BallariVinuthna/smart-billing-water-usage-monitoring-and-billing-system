import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaTint, FaFileInvoiceDollar, FaChartBar, FaUsers, FaExclamationTriangle } from 'react-icons/fa';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    // Define menu items based on role
    let menuItems = [];

    if (role === 'admin') {
        menuItems = [
            { path: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
            { path: '/admin/users', icon: FaUsers, label: 'Users' },
            { path: '/admin/buildings', icon: FaBuilding, label: 'Buildings' },
            // { path: '/admin/system-analytics', icon: FaChartBar, label: 'Analytics' },
        ];
    } else if (role === 'manager') {
        menuItems = [
            { path: '/manager/dashboard', icon: FaHome, label: 'Dashboard' },
            { path: '/manager/meter-readings', icon: FaTint, label: 'Readings' },
            { path: '/manager/billing', icon: FaFileInvoiceDollar, label: 'Billing' },
            { path: '/manager/alerts', icon: FaExclamationTriangle, label: 'Alerts' },
            { path: '/manager/reports', icon: FaChartBar, label: 'Reports' },
        ];
    } else if (role === 'resident') {
        menuItems = [
            { path: '/resident/dashboard', icon: FaHome, label: 'Dashboard' },
            { path: '/resident/usage-history', icon: FaTint, label: 'Usage' },
            { path: '/resident/monthly-bill', icon: FaFileInvoiceDollar, label: 'Bills' },
            { path: '/resident/alerts', icon: FaExclamationTriangle, label: 'Alerts' },
        ];
    }

    return (
        <div className="flex flex-col w-64 h-screen bg-slate-900 text-white">
            <div className="p-5 font-bold text-center border-b border-gray-700">
                Menu
            </div>
            <div className="flex-1 overflow-y-auto">
                <ul className="py-4 space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-6 py-3 transition ${isActive(item.path)
                                    ? 'bg-primary text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="mr-3 text-lg" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
