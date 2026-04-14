import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import About from './pages/About';
import Support from './pages/Support';
import PlateChoice from './pages/PlateChoice';
import FoodParcel from './pages/FoodParcel';
import WardenLogin from './pages/warden/WardenLogin';
import WardenDashboard from './pages/warden/WardenDashboard';
import StaffLogin from './pages/staff/StaffLogin';
import StaffDashboard from './pages/staff/StaffDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={allowedRole === 'warden' ? '/warden-portal' : '/staff-portal'} replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/plate-choice" element={<PlateChoice />} />
          <Route path="/food-parcel" element={<FoodParcel />} />
          
          {/* Warden Routes */}
          <Route path="/warden-portal" element={<WardenLogin />} />
          <Route
            path="/warden-dashboard"
            element={
              <ProtectedRoute allowedRole="warden">
                <WardenDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Staff Routes */}
          <Route path="/staff-portal" element={<StaffLogin />} />
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute allowedRole="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
