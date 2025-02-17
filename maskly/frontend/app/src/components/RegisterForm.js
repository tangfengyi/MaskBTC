import React, { useState } from 'react';
import { register } from '../services/authService';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

const validateInputs = () => {
    if (username.length < 1 || username.length > 30720) {
      setMessage('Username must be between 1 and 30720 characters');
      return false;
    }
    if (password.length < 1 || password.length > 30720) {
      setMessage('Password must be between 1 and 30720 characters');
      return false;
    }
    return true;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateInputs()) return;
    
    try {
        const data = await register(username, password);
      setMessage(`Registration successful: ${data.user.username}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RegisterForm;

