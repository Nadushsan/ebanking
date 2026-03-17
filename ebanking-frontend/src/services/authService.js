import axios from 'axios';

const API_URL = 'http://localhost:8081/auth/';

class AuthService {
    login(username, password) {
        console.log('🔐 AuthService.login appelé avec:', { username, password });
        
        return axios.post(API_URL + 'login', { username, password })
            .then(response => {
                console.log('✅ Réponse login reçue:', response.data);
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            })
            .catch(error => {
                console.error('❌ Erreur Axios détaillée:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                throw error;
            });
    }

    register(username, password, email, firstName, lastName) {
        return axios.post(API_URL + 'register', {
            username, password, email, firstName, lastName
        });
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    getAuthHeader() {
        const user = this.getCurrentUser();
        console.log('👤 Utilisateur depuis storage:', user);
        if (user && user.token) {
            console.log('✅ Token trouvé:', user.token.substring(0, 20) + '...');
            return { Authorization: 'Bearer ' + user.token };
        } else {
            console.log('❌ Aucun token trouvé');
            return {};
        }
    }

    verifyTwoFactor(username, code) {
        console.log('🔐 verifyTwoFactor appelé avec:', { username, code });
        
        return axios.post(API_URL + `verify-2fa?username=${username}`, { code })
            .then(response => {
                console.log('✅ verifyTwoFactor réponse:', response.data);
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            })
            .catch(error => {
                console.error('❌ verifyTwoFactor erreur:', error.response?.data || error.message);
                throw error;
            });
    }

    resendTwoFactorCode(username) {
        console.log('📧 resendTwoFactorCode pour:', username);
        return axios.post(API_URL + `resend-2fa?username=${username}`, {})
            .then(response => response.data)
            .catch(error => {
                console.error('❌ resendTwoFactorCode erreur:', error.response?.data || error.message);
                throw error;
            });
    }

    setupTwoFactor(username) {
        console.log('📱 setupTwoFactor pour:', username);
        const headers = this.getAuthHeader();
        
        return axios.post(API_URL + `setup-2fa?username=${username}`, {}, {
            headers: headers
        })
        .then(response => {
            console.log('✅ setupTwoFactor réponse:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('❌ setupTwoFactor erreur:', error.response?.data || error.message);
            throw error;
        });
    }

    disableTwoFactor(username) {
        console.log('🔴 disableTwoFactor pour:', username);
        return axios.delete(API_URL + `disable-2fa?username=${username}`, {
            headers: this.getAuthHeader()
        })
        .then(response => response.data);
    }
}

export default new AuthService();