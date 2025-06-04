import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ZAR',
    provider: 'SWIFT',
    accountNumber: '',
    swiftCode: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!user || role !== 'customer') {
      window.location.href = '/login';
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.amount || !formData.accountNumber || !formData.swiftCode) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setMessage('');
    setIsLoading(true);

    const apiUrl = '/api/SecureWebsite/makepayment'; // Use relative URL

    try {
      const response = await axios.post(apiUrl, formData, {
        withCredentials: true, // Ensure cookies are sent for auth
      });

      setMessage(response.data.message || 'Payment processed successfully.');
    } catch (error) {
      console.error('Payment error:', error.response || error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          'Payment failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Make a Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="currency"
          onChange={handleChange}
          value={formData.currency}
          className="w-full p-2 border rounded"
        >
          <option value="ZAR">ZAR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <select
          name="provider"
          onChange={handleChange}
          value={formData.provider}
          className="w-full p-2 border rounded"
        >
          <option value="SWIFT">SWIFT</option>
        </select>

        <input
          name="accountNumber"
          placeholder="Account Number"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="swiftCode"
          placeholder="SWIFT Code"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.toLowerCase().includes('fail') || message.toLowerCase().includes('error')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Home;
