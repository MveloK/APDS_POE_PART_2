import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import ProtectedEmployeeRoutes from './ProtectedEmployeeRoutes';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  const role = localStorage.getItem('role');
  const isLoggedIn = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <Router>
      <section>
        <div className="top-nav">
          {isLoggedIn ? (
            <span className="item-holder">
              {role === 'employee' ? (
                <>
                  <a href="/employee-dashboard">Dashboard</a>
                  <span onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '1rem' }}>
                    Log Out
                  </span>
                </>
              ) : (
                <>
                  <a href="/home">Home</a>
                  <span onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '1rem' }}>
                    Log Out
                  </span>
                </>
              )}
            </span>
          ) : (
            <span className="item-holder">
              <a href="/login">User Login</a>
              <a href="/register">Register</a>
              <a href="/employee-login">Employee Login</a>
            </span>
          )}
        </div>

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                role === 'employee' ? <Navigate to="/employee-dashboard" /> : <Navigate to="/home" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home />} />
          </Route>

          <Route element={<ProtectedEmployeeRoutes />}>
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div>
                <header>
                  <h1>Page Not Found</h1>
                </header>
                <p>
                  <a href="/">Back to Home page</a>
                </p>
              </div>
            }
          />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
