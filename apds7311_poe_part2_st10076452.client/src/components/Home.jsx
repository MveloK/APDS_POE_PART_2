import { useState } from 'react';
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

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.amount || !formData.accountNumber || !formData.swiftCode) {
      setMessage('Please fill in all the fields.');
      return;
    }

    setMessage('');
    setIsLoading(true);

    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api-url/api/SecureWebsite/makepayment' 
      : 'http://localhost:5000/api/SecureWebsite/makepayment';

    try {
      const res = await axios.post(apiUrl, formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow-md bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Make a Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        
        <select name="currency" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="ZAR">ZAR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <select name="provider" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="SWIFT">SWIFT</option>
        </select>

        <input
          name="accountNumber"
          placeholder="Account Number"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="swiftCode"
          placeholder="SWIFT Code"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Home;
