import React from 'react';
import useAuth from '../context/useAuth';

const AuthTest = () => {
  try {
    const { user, isAuthenticated, login, register, logout, isLoading, error } = useAuth();

    const handleTestLogin = async () => {
      try {
        await login('test@example.com', 'password123');
      } catch (err) {
        console.error('Login test failed:', err);
      }
    };

    const handleTestRegister = async () => {
      try {
        await register({
          name: 'Test User',
          email: 'newuser@example.com',
          password: 'password123'
        });
      } catch (err) {
        console.error('Register test failed:', err);
      }
    };

    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Authentication Test</h2>

        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Current Status:</h3>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
          <p>Error: {error || 'None'}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleTestLogin}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Login
          </button>

          <button
            onClick={handleTestRegister}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Register
          </button>

          {isAuthenticated && (
            <button
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          <p>✅ AuthProvider hoạt động!</p>
          <p>This page tests the authentication system with mock responses.</p>
          <p>Use any email/password to test login functionality.</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', background: '#f5e8e8', margin: '20px', borderRadius: '8px' }}>
        <h3>❌ AuthProvider không hoạt động</h3>
        <p>Error: {error.message}</p>
      </div>
    );
  }
};

export default AuthTest;
