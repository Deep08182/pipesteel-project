const API_URL = '/api';

const api = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token) => localStorage.setItem('token', token),
    removeToken: () => localStorage.removeItem('token'),
    
    getHeaders: (isJson = true) => {
        const headers = {};
        if (isJson) headers['Content-Type'] = 'application/json';
        const token = api.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    },

    post: async (endpoint, data) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.msg || 'API Error');
        return result;
    },

    get: async (endpoint) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: api.getHeaders()
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.msg || 'API Error');
        return result;
    },
    
    patch: async (endpoint, data) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: api.getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.msg || 'API Error');
        return result;
    },

    logout: () => {
        api.removeToken();
        localStorage.removeItem('ar_user'); // remove any remaining legacy data
        localStorage.removeItem('ar_role');
        window.location.href = '/login.html';
    }
};

window.api = api;
