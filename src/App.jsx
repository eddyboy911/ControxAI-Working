import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OnboardingPage from './pages/OnboardingPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// New Dashboard Refactored Structure
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import CallLogsPage from './pages/dashboard/CallLogsPage';
import BookingsPage from './pages/dashboard/BookingsPage';
import TestAgentPage from './pages/dashboard/TestAgentPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import BillingPage from './pages/dashboard/BillingPage';
import SettingsPage from './pages/dashboard/SettingsPage';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireSuperAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Dashboard Nested Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireClient>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect to overview */}
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="call-logs" element={<CallLogsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="test-agent" element={<TestAgentPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
