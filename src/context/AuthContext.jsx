import React, { createContext, useReducer, useEffect } from 'react';
import { apiClient as apiService } from '../utils/apiClient.js';
import { initialState, AUTH_ACTIONS, authReducer } from './AuthContextUtils.js';
import { STORAGE_KEYS } from '../utils/constants.js';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);

      if (token && userInfo) {
        try {
          // Verify token with backend
          await apiService.get('/auth/verify');
          
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: JSON.parse(userInfo),
              token: token
            }
          });
        } catch {
          // Token is invalid, clear storage
          localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          apiService.removeAuthToken(); // Add this to clean up the token in apiService
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await apiService.post('/auth/login', { email, password });
      
      // Store token and user info
      apiService.setAuthToken(response.token);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await apiService.post('/auth/register', userData);
      
      // Store token and user info
      apiService.setAuthToken(response.token);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear storage
    apiService.removeAuthToken();
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    const response = await apiService.put('/users/profile', userData);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: {
        user: response.user,
        token: state.token
      }
    });
    return response;
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export default AuthProvider; 