
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateLetter from './pages/CreateLetter';
import Archive from './pages/Archive';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import PublicLanding from './pages/PublicLanding';
import MasterData from './pages/MasterData';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isPublicVerify = location.pathname.startsWith('/verify/');
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Public Verification Portal (Highest Priority)
  if (isPublicVerify) {
    return (
      <Routes>
        <Route path="/verify/:id" element={<Verify />} />
      </Routes>
    );
  }

  // Public Landing Page (Second Priority)
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<PublicLanding />} />
      </Routes>
    );
  }

  // Authentication Pages
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // Protected Admin Dashboard
  return (
    <PrivateRoute>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateLetter />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/master-data" element={<MasterData />} />
          {/* Catch-all for logged in users */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </PrivateRoute>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
