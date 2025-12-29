import { createContext, useContext, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { props } = usePage();

  // Función para actualizar el usuario desde las props de Inertia
  const updateUserFromProps = (propsUser) => {
    if (propsUser) {
      setUser({
        id: propsUser.id,
        username: propsUser.username,
        role_id: propsUser.role_id,
        role: propsUser.role ? {
          id: propsUser.role.id,
          name: propsUser.role.name || propsUser.role
        } : null,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // PRIORIDAD 1: Intentar obtener el usuario de las props de Inertia (más confiable en servidor)
    if (props?.auth?.user) {
      updateUserFromProps(props.auth.user);
      return;
    }

    // PRIORIDAD 2: Intentar obtener el usuario del localStorage (guardado después del login)
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

    // PRIORIDAD 3: Si no hay usuario en localStorage, intentar obtenerlo del token
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUserFromToken(token);
    } else {
      setIsLoading(false);
    }
  }, [props?.auth?.user]);

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

