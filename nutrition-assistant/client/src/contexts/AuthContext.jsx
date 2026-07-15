import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Set authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const register = useCallback(async (name, email, password, role = 'user') => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });

      const { token: newToken, refreshToken: newRefreshToken, user: userData } = response.data.data;

      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, refreshToken: newRefreshToken, user: userData } = response.data.data;

      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        refreshToken,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      delete axios.defaults.headers.common['Authorization'];
    }
  }, [refreshToken]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (resetToken, password, confirmPassword) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password/${resetToken}`,
        { password, confirmPassword }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const { token: newToken, refreshToken: newRefreshToken } = response.data.data;

      setToken(newToken);
      setRefreshToken(newRefreshToken);

      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  }, [refreshToken, logout]);

  const value = {
    user,
    token,
    refreshToken,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
