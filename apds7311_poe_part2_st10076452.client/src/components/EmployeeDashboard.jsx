import React, { useEffect, useState } from 'react';

function EmployeeDashboard() {
  const [employeeInfo, setEmployeeInfo] = useState({
    fullName: '',
    employeeNumber: '',
    role: '',
  });

  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = 'Employee Dashboard';
    const role = localStorage.getItem('role');
    const employeeNumber = localStorage.getItem('user');

    if (role !== 'employee' || !employeeNumber) {
      window.location.href = '/employee-login';
      return;
    }

    fetchEmployeeDetails(employeeNumber);
    fetchUsers();
    fetchPayments();
  }, []);

  const fetchEmployeeDetails = async (empNo) => {
    try {
      const res = await fetch(`/api/SecureWebsite/employee/${empNo}`);
      if (res.ok) {
        const data = await res.json();
        setEmployeeInfo({
          fullName: data.fullName,
          employeeNumber: data.employeeNumber,
          role: data.role,
        });
      } else {
        setMessage('Unable to fetch employee data.');
      }
    } catch (error) {
      console.error('Error fetching employee info:', error);
      setMessage('Server error while loading employee info.');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/SecureWebsite/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.warn('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/SecureWebsite/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      } else {
        console.warn('Failed to fetch payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/employee-login';
  };

  return (
    <section className="dashboard-wrapper page">
      <div className="dashboard">
        <header>
          <h1>Welcome, {employeeInfo.fullName || 'Employee'}!</h1>
          <p>Role: {employeeInfo.role || 'N/A'}</p>
          <p>Employee Number: {employeeInfo.employeeNumber || 'N/A'}</p>
        </header>

        {message && <p className="message">{message}</p>}

        <div style={{ marginTop: '2rem' }}>
          <h2>Registered Users</h2>
          <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Account Number</th>
                <th>ID Number</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, idx) => (
                  <tr key={idx}>
                    <td>{user.fullName}</td>
                    <td>{user.accNumber}</td>
                    <td>{user.idNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <h2>Payment Requests</h2>
          <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Account Number</th>
                <th>SWIFT Code</th>
                <th>Date Created</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((pmt, idx) => (
                  <tr key={idx}>
                    <td>{pmt.id}</td>
                    <td>{pmt.accountNumber}</td>
                    <td>{pmt.swiftCode}</td>
                    <td>{new Date(pmt.dateCreated).toLocaleString()}</td>
                    <td>{pmt.userId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No payment data found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default EmployeeDashboard;
