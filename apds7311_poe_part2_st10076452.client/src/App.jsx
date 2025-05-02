import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  const isLogged = localStorage.getItem('users');

  return (
    <section>
      <div className="top-nav">
        {isLogged ? (
          <span className="item-holder">
            <a href="/home">Home</a>
            <span
              onClick={() => {
                localStorage.removeItem('users');
                window.location.reload();  // Refresh the page after logging out
              }}
            >
              Log Out
            </span>
          </span>
        ) : (
          <span className="item-holder">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </span>
        )}
      </div>

      <Router>
        <Routes>
          {/* Default route redirects to the registration page */}
          <Route path="/" element={<Navigate to="/register" />} />

          {/* Protected routes (e.g., the home page) */}
          <Route element={<ProtectedRoutes />}>
            <Route path="home" element={<Home />} />
          </Route>

          {/* Public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Catch-all route for invalid URLs */}
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
      </Router>
    </section>
  );
}

export default App;
