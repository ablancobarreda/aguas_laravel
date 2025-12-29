import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Primero intentar obtener el usuario del localStorage (guardado después del login)
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          id: userData.id,
          username: userData.username,
          role_id: userData.role_id,
          role: userData.role ? { name: userData.role.name || userData.role } : null,
        });
        setIsLoading(false);
        return;
      } catch (e) {
        // Si falla, continuar con el token
      }
    }

    // Si no hay usuario en localStorage, intentar obtenerlo del token
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUserFromToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Función para actualizar el usuario desde las props de Inertia
  const updateUserFromProps = (propsUser) => {
    if (propsUser) {
      setUser(propsUser);
      setIsLoading(false);
    }
  };

  const fetchUserFromToken = async (token) => {
    try {
      // Decodificar el token JWT básico para obtener el ID del usuario
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const userId = payload.id;

        // Hacer petición para obtener el usuario
        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.data) {
          const userData = response.data.data;
          setUser({
            id: userData.id,
            username: userData.username,
            role_id: userData.role_id,
            role: userData.role ? { name: userData.role } : null,
          });
        }
      }
    } catch (error) {
      console.error('Error obteniendo usuario del token:', error);
      // Si falla, limpiar el token inválido
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAdmin: user?.role_id === 1,
    isLoading,
    updateUserFromProps,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

