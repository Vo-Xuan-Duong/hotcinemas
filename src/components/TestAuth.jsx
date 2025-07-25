import React from 'react';
import useAuth from '../context/useAuth';

const TestAuth = () => {
  try {
    const { user, isAuthenticated, isLoading } = useAuth();

    return (
      <div style={{ padding: '20px', border: '1px solid green', margin: '20px' }}>
        <h3>Auth Test - SUCCESS</h3>
        <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>user: {user ? user.email || 'User object exists' : 'null'}</p>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid red', margin: '20px' }}>
        <h3>Auth Test - ERROR</h3>
        <p>{error.message}</p>
      </div>
    );
  }
};

export default TestAuth;
