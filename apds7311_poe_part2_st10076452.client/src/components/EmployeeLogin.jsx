import React, { useState, useEffect } from 'react';

function EmployeeLogin() {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = 'Employee Login';
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');

    if (user && role === 'employee') {
      window.location.href = '/employee-dashboard';
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    const dataToSend = {
      EmployeeNumber: employeeNumber,
      Password: password,
    };

    try {
      const res = await fetch('/api/SecureWebsite/employee-login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        // Match app logic: store 'user' and 'role'
        localStorage.setItem('user', employeeNumber);
        localStorage.setItem('role', 'employee');
        window.location.href = '/employee-dashboard';
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setMessage('Network error.');
      console.error(err);
    }
  }

  return (
    <section className="login-page-wrapper page">
      <div className="login-page">
        <h1>Employee Login</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleLogin}>
          <label htmlFor="employeeNumber">Employee Number</label>
          <input
            type="text"
            id="employeeNumber"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input type="submit" value="Login" className="login btn" />
        </form>
      </div>
    </section>
  );
}

export default EmployeeLogin;
