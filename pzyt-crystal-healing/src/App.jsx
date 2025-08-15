import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PredictionPage from './pages/PredictionPage';
import PredictionResultPage from './pages/PredictionResultPage';
import PaymentPage from './pages/PaymentPage';
import DashboardPage from './pages/DashboardPage';
import CrystalsPage from './pages/CrystalsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* 公开页面 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/crystals" element={<CrystalsPage />} />
            
            {/* 受保护的页面 */}
            <Route path="/prediction" element={
              <ProtectedRoute>
                <PredictionPage />
              </ProtectedRoute>
            } />
            <Route path="/prediction/result" element={
              <ProtectedRoute>
                <PredictionResultPage />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* 404页面 */}
            <Route path="*" element={
              <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-purple-200 mb-4">页面未找到</p>
                  <a href="/" className="text-purple-300 hover:text-purple-200 underline">
                    返回首页
                  </a>
                </div>
              </div>
            } />
          </Routes>
          
          {/* Toast 通知 */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(139, 69, 19, 0.9)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;