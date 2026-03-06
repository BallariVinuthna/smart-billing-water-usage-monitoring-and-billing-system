import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import UsageHistory from './pages/UsageHistory';
import MonthlyBill from './pages/MonthlyBill';
import ResidentAlerts from './pages/ResidentAlerts';
import MeterReadings from './pages/MeterReadings';
import BillingManagement from './pages/BillingManagement';
import ManagerAlerts from './pages/ManagerAlerts';
import ManageUsers from './pages/ManageUsers';
import ManageBuildings from './pages/ManageBuildings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/resident/dashboard" element={<ResidentDashboard />} />

          {/* Resident Routes */}
          <Route path="/resident/usage-history" element={<UsageHistory />} />
          <Route path="/resident/monthly-bill" element={<MonthlyBill />} />
          <Route path="/resident/alerts" element={<ResidentAlerts />} />

          {/* Manager Routes */}
          <Route path="/manager/meter-readings" element={<MeterReadings />} />
          <Route path="/manager/billing" element={<BillingManagement />} />
          <Route path="/manager/billing" element={<BillingManagement />} />
          <Route path="/manager/alerts" element={<ManagerAlerts />} />

          {/* Admin Routes */}
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/buildings" element={<ManageBuildings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
