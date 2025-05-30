import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Me from './pages/Me';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider, useAuth } from './utils/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import You from './pages/You';
import Us from './pages/Us';
import Profile from './pages/Profile';
import About from './pages/About';
import DynamicPage from './pages/DynamicPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <Me />
          </ProtectedRoute>
        }
      />
      <Route
        path="/you"
        element={
          <ProtectedRoute>
            <You />
          </ProtectedRoute>
        }
      />
      <Route
        path="/us"
        element={
          <ProtectedRoute>
            <Us />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/callback" element={<div>Loading...</div>} />
      
      <Route path="/support" element={<Home />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/:slug" element={<DynamicPage />} />
    </Routes>
  );
};

const App = () => {
  const domain = 'dev-e6x03xfvvs8ym6el.us.auth0.com';
  const clientId = 'LlivSOguqed6loGPIlOm9iWtgbesK9LQ';
  const clientSecret = 'BPAxvLcfD8eDdf9u7ov8HbXWy63cyygAOOSUnRXbY1l9-iwBOgHwd85ZaYGv7aJ-';
  const redirectUri = 'http://localhost:5173/callback';
  React.useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        document.body.classList.add('user-logged-in');
      } else {
        document.body.classList.remove('user-logged-in');
      }
    }, []);
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      clientSecret={clientSecret}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email offline_access"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </Auth0Provider>
  );
};

export default App;
