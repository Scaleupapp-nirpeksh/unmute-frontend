import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Ensure the path is correct

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend
          const response = await api.get('/api/auth/user');
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    login: (token, userData) => {
      localStorage.setItem('token', token);
      setUser(userData);
    },
    logout: () => {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only after loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
