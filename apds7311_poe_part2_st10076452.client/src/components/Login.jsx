import { useEffect } from 'react';

function Login() {
  document.title = 'Login';

  // Check if the user is already logged in (based on localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      // If user is already logged in, redirect to home page
      document.location = '/';
    }
  }, []);

  // Handle form submission and login process
  async function loginHandler(e) {
    e.preventDefault();
    const form = e.target;
    const submitter = document.querySelector('input.login');
    const formData = new FormData(form, submitter);
    const dataToSend = {};

    // Convert FormData to an object
    for (const [key, value] of formData) {
      dataToSend[key] = value;
    }

    // Send login request to the backend
    const response = await fetch('/api/SecureWebsite/login', {
      method: 'POST',
      credentials: 'include', // Include cookies if needed
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    const messageEl = document.querySelector('.message');

    if (response.ok) {
      // If login is successful, save user to localStorage
      localStorage.setItem('user', dataToSend.accNumber);
      // Redirect to home page
      document.location = '/';
    } else {
      // If login fails, show error message
      if (data.message) {
        messageEl.innerHTML = data.message;
      } else {
        messageEl.innerHTML = 'Something has gone wrong. Please try again.';
      }
    }

    console.log('Login response:', data);
  }

  return (
    <section className="login-page-wrapper page">
      <div className="login-page">
        <header>
          <h1>Login Page</h1>
        </header>
        <p className="message"></p> {/* Error or success messages */}
        <div className="form-holder">
          <form className="login" onSubmit={loginHandler}>
            <label htmlFor="accNumber">Account Number</label>
            <input type="text" name="accNumber" id="accNumber" required />

            <label htmlFor="Password">Password</label>
            <input type="password" name="Password" id="Password" required />

            <br />
            <input type="submit" value="Login" className="login btn" />
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
