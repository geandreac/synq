/**
 * Serviço de API do SYNQ.
 * Centraliza as chamadas ao backend com tratamento de erros padronizado.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

export const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`[SYNQ API] Requesting: ${url}`, options.method || 'GET');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error(`[API ERROR] ${endpoint}:`, error);
            throw error;
        }
    },

    auth: {
        async signup(data) {
            return api.request('/auth/signup', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        async login(data) {
            return api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
    },

    workspaces: {
        async list() {
            const token = localStorage.getItem('synq_token');
            return api.request('/workspaces', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        async create(name) {
            const token = localStorage.getItem('synq_token');
            return api.request('/workspaces', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name })
            });
        },
        async listMembers(workspaceId) {
            const token = localStorage.getItem('synq_token');
            return api.request(`/workspaces/${workspaceId}/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        async inviteMember(workspaceId, email, role = 'MEMBER') {
            const token = localStorage.getItem('synq_token');
            return api.request(`/workspaces/${workspaceId}/members`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email, role })
            });
        }
    },

    boards: {
        async listByWorkspace(workspaceId) {
            const token = localStorage.getItem('synq_token');
            return api.request(`/boards/workspace/${workspaceId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        async create(name, workspaceId) {
            const token = localStorage.getItem('synq_token');
            return api.request('/boards', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, workspaceId })
            });
        }
    },

    lists: {
        async create(name, boardId, order) {
            const token = localStorage.getItem('synq_token');
            return api.request('/lists', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, boardId, order })
            });
        }
    },

    cards: {
        async create(title, listId, order) {
            const token = localStorage.getItem('synq_token');
            return api.request('/cards', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, listId, order })
            });
        },
        async update(id, data) {
            const token = localStorage.getItem('synq_token');
            return api.request(`/cards/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
        }
    }
};
