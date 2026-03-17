import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8081/api/';
const AUTH_URL = 'http://localhost:8081/auth/'; // Ajoute cette ligne pour les endpoints d'authentification

class ApiService {
    // ========== COMPTES ==========
    createAccount(accountData) {
        return axios.post(API_URL + 'accounts', accountData, {
            headers: authService.getAuthHeader()
        });
    }

    getMyAccounts() {
        return axios.get(API_URL + 'accounts/my-accounts', {
            headers: authService.getAuthHeader()
        });
    }

    getAccount(id) {
        return axios.get(API_URL + 'accounts/' + id, {
            headers: authService.getAuthHeader()
        });
    }

    // ========== TRANSACTIONS ==========
    deposit(accountId, amount, description) {
        return axios.post(API_URL + `transactions/deposit/${accountId}`, null, {
            params: { amount, description },
            headers: authService.getAuthHeader()
        });
    }

    withdraw(accountId, amount, description) {
        return axios.post(API_URL + `transactions/withdraw/${accountId}`, null, {
            params: { amount, description },
            headers: authService.getAuthHeader()
        });
    }

    transfer(fromAccountId, toAccountNumber, amount, description) {
        return axios.post(API_URL + `transactions/transfer/${fromAccountId}`, null, {
            params: { toAccountNumber, amount, description },
            headers: authService.getAuthHeader()
        });
    }

    getTransactionHistory(accountId) {
        return axios.get(API_URL + `transactions/history/${accountId}`, {
            headers: authService.getAuthHeader()
        });
    }

    // ========== 2FA ==========
    // ATTENTION: Utilise AUTH_URL (sans /api/) pour les endpoints d'authentification
    setupTwoFactor(username) {
        console.log('📱 Configuration 2FA pour:', username);
        const headers = authService.getAuthHeader();
        console.log('🔑 Headers envoyés:', headers);
        
        return axios.post(`http://localhost:8081/auth/setup-2fa?username=${username}`, {}, {
            headers: headers
        })
        .then(response => {
            console.log('✅ Réponse 2FA reçue:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('❌ Erreur détaillée:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        });
    }

    disableTwoFactor(username) {
        console.log('🔴 Désactivation 2FA pour:', username);
        return axios.delete(`http://localhost:8081/auth/disable-2fa?username=${username}`, {
            headers: authService.getAuthHeader()
        })
        .then(response => response.data);
    }

    resendTwoFactorCode(username) {
        console.log('📧 Renvoi code 2FA pour:', username);
        return axios.post(`http://localhost:8081/auth/resend-2fa?username=${username}`, {}, {
            headers: authService.getAuthHeader()
        })
        .then(response => response.data);
    }
}

export default new ApiService();