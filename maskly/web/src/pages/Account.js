import React, { useState } from 'react';

function Account() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    walletAddress: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Would typically make API call to update user info
    console.log('Updating account:', user);
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            value={user.username} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={user.email} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Wallet Address:</label>
          <input 
            type="text" 
            name="walletAddress" 
            value={user.walletAddress} 
            onChange={handleChange} 
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Account;
