import axios from 'axios';
import { router } from '@inertiajs/react';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configurar Inertia para enviar el token en todas las peticiones
// Interceptar todas las peticiones de Inertia para agregar el token
const token = localStorage.getItem('auth_token');
if (token) {
    // Configurar el token en el header por defecto de axios (usado por Inertia internamente)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Actualizar cuando cambie el token
    window.addEventListener('storage', (e) => {
        if (e.key === 'auth_token') {
            const newToken = localStorage.getItem('auth_token');
            if (newToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            } else {
                delete axios.defaults.headers.common['Authorization'];
            }
        }
    });
}
