import { useEffect, useState } from 'react';

function Register() {
  document.title = 'Register';

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      document.location = '/';
    }
  }, []);

  async function registerHandler(e) {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setIsLoading(true);

    const form = e.target;
    const formData = new FormData(form);
    const dataToSend = {};

    // Convert FormData to plain object
    for (const [key, value] of formData) {
      dataToSend[key] = value;
    }

    // Set UserName as accNumber (required for Identity)
    dataToSend.UserName = dataToSend.accNumber;

    try {
      // Perform the registration request
      const response = await fetch('/api/SecureWebsite/register', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(dataToSend),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // If registration is successful, redirect to login
        document.location = '/login';
      } else {
        // If registration fails, display error messages
        let errorMessages = `<div>${data.message}</div>`;
        if (data.errors) {
          errorMessages += "<div class='normal'>";
          data.errors.forEach((error) => {
            errorMessages += `<p>${error}</p>`;
          });
          errorMessages += '</div>';
        }
        setMessage(errorMessages);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="register-page-wrapper page">
      <div className="register-page">
        <header>
          <h1>Register Page</h1>
        </header>
        <p className="message" dangerouslySetInnerHTML={{ __html: message }}></p>
        <div className="form-holder">
          <form className="register" onSubmit={registerHandler}>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" name="fullName" id="fullName" required />

            <label htmlFor="idNumber">ID Number</label>
            <input type="text" name="idNumber" id="idNumber" required />

            <label htmlFor="accNumber">Account Number</label>
            <input type="text" name="accNumber" id="accNumber" required />

            <label htmlFor="Password">Password</label>
            <input type="password" name="Password" id="Password" required />

            <br />
            <button type="submit" className="register btn" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
