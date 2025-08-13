import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import CertificatePage from './pages/CertificatePage';
import StartupConnect from './pages/StartupConnect';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Styles
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/course/:courseId" 
                  element={
                    <ProtectedRoute>
                      <CoursePlayer />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/certificates" 
                  element={
                    <ProtectedRoute>
                      <CertificatePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/startup-connect" 
                  element={
                    <ProtectedRoute>
                      <StartupConnect />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment/:courseId" 
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;

