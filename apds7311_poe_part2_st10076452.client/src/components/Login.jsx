import React, { useState, useEffect } from 'react';

function Login() {
  const [accNumber, setAccNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isEmployee, setIsEmployee] = useState(false); // Track if logging in as employee
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login';
    // Clear any old login info on page load
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }, []);

  async function loginHandler(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const dataToSend = {
      AccNumber: accNumber.trim(),
      Password: password,
    };

    const endpoint = isEmployee
      ? '/api/SecureWebsite/employee-login'
      : '/api/SecureWebsite/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(dataToSend),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid JSON from server');
      }

      if (response.ok) {
        localStorage.setItem('user', accNumber.trim());
        localStorage.setItem('role', isEmployee ? 'employee' : 'customer');
        window.location.href = isEmployee ? '/employee-dashboard' : '/home';
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }

      console.log('Login response:', data);
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page-wrapper page">
      <div className="login-page">
        <header>
          <h1>Login Page</h1>
        </header>
        {message && <p className="message" style={{ display: 'block' }}>{message}</p>}
        <div className="form-holder">
          <form className="login" onSubmit={loginHandler}>
            <label htmlFor="accNumber">Account Number</label>
            <input
              type="text"
              name="AccNumber"
              id="accNumber"
              required
              value={accNumber}
              onChange={(e) => setAccNumber(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="Password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={{ marginTop: '10px' }}>
              <label>
                <input
                  type="radio"
                  name="userType"
                  checked={!isEmployee}
                  onChange={() => setIsEmployee(false)}
                />
                Customer
              </label>
              <label style={{ marginLeft: '15px' }}>
                <input
                  type="radio"
                  name="userType"
                  checked={isEmployee}
                  onChange={() => setIsEmployee(true)}
                />
                Employee
              </label>
            </div>

            <br />
            <input
              type="submit"
              value={loading ? 'Logging in...' : 'Login'}
              className="login btn"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
