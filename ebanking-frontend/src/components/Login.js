import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import authService from '../services/authService';
import TwoFactorVerify from './TwoFactorVerify';

function Login({ onLogin, onSwitchToRegister }) {
    const { t } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [tempUsername, setTempUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Tentative de connexion avec:', { username, password });
        
        if (!username || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await authService.login(username, password);
            console.log('Réponse du serveur:', response);
            
            // Vérifier si la 2FA est requise
            if (response.twoFactorRequired) {
                console.log('🔐 2FA requise pour:', username);
                setTempUsername(username);
                setTwoFactorRequired(true);
                setError('');
            } else {
                // Connexion normale (pas de 2FA)
                onLogin(response);
            }
        } catch (err) {
            console.error('Erreur complète:', err);
            console.error('Réponse erreur:', err.response?.data);
            setError(t('usernamePasswordIncorrect') || 'Nom d\'utilisateur ou mot de passe incorrect');
        }
    };

    const handle2FASuccess = (userData) => {
        console.log('✅ 2FA vérifiée avec succès, connexion finale');
        onLogin(userData);
    };

    const handle2FACancel = () => {
        console.log('❌ 2FA annulée, retour au login');
        setTwoFactorRequired(false);
        setTempUsername('');
        setUsername('');
        setPassword('');
    };

    // Si la 2FA est requise, afficher la page de vérification
    if (twoFactorRequired) {
        return (
            <TwoFactorVerify
                username={tempUsername}
                onSuccess={handle2FASuccess}
                onCancel={handle2FACancel}
            />
        );
    }

    // Sinon, afficher le formulaire de login normal
    return (
        <div className="login-page">
            <div className="login-hero">
                <div className="login-hero-content">
                    <h1>{t('welcome')}</h1>
                    <p className="hero-subtitle">{t('loginSubtitle')}</p>
                    
                    <div className="login-features">
                        <div className="feature-item">
                            <Shield size={24} />
                            <div>
                                <strong>{t('secure')}</strong>
                                <span>{t('encryptedTransactions')}</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Zap size={24} />
                            <div>
                                <strong>{t('fast')}</strong>
                                <span>{t('instantTransfers')}</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Clock size={24} />
                            <div>
                                <strong>{t('available')}</strong>
                                <span>{t('247')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mini-card">
                        <div className="mini-card-header">
                            <div className="mini-card-chip"></div>
                            <span className="mini-card-type">VISA</span>
                        </div>
                        <div className="mini-card-number">•••• 4242</div>
                        <div className="mini-card-footer">
                            <span className="mini-card-holder">PRATHAM CHAVAN</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-form-wrapper">
                <div className="login-form-container">
                    <h2>{t('login')}</h2>
                    <p className="form-subtitle">{t('accessSecureSpace')}</p>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>{t('username')}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={t('username')}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('password')}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>{t('rememberMe')}</span>
                            </label>
                            <a href="#" className="forgot-password">{t('forgotPassword')}</a>
                        </div>

                        <button type="submit" className="login-button">
                            {t('login')} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="register-prompt">
                        {t('noAccount')}{' '}
                        <button onClick={onSwitchToRegister} className="register-link">
                            {t('register')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;