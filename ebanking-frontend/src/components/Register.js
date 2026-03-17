import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, User, Lock, ArrowRight } from 'lucide-react';
import authService from '../services/authService';

function Register({ onSwitchToLogin }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.register(
                formData.username,
                formData.password,
                formData.email,
                formData.firstName,
                formData.lastName
            );
            setMessage(t('registrationSuccess'));
            setTimeout(() => onSwitchToLogin(), 2000);
        } catch (err) {
            console.log('Erreur:', err.response?.data);
            setError(err.response?.data?.message || t('registrationError'));
        }
    };

    return (
        <div className="register-page">
            <div className="register-hero">
                <div className="register-hero-content">
                    <h1>{t('createAccount')}</h1>
                    <p className="hero-subtitle">{t('registerSubtitle')}</p>

                    <div className="register-illustration">
                        <div className="illustration-card">
                            <div className="illustration-card-header">
                                <div className="card-chip"></div>
                                <span className="card-type">VISA</span>
                            </div>
                            <div className="illustration-card-number">**** **** **** 4242</div>
                            <div className="illustration-card-footer">
                                <span>PRATHAM CHAVAN</span>
                                <span>12/25</span>
                            </div>
                        </div>
                    </div>

                    <div className="register-benefits">
                        <div className="benefit-item">
                            <div className="benefit-dot"></div>
                            <span>{t('simplifiedManagement')}</span>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-dot"></div>
                            <span>{t('secureTransactions')}</span>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-dot"></div>
                            <span>{t('support247')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="register-form-wrapper">
                <div className="register-form-container">
                    <h2>{t('register')}</h2>
                    <p className="form-subtitle">{t('createPersonalSpace')}</p>

                    {message && <div className="register-success">{message}</div>}
                    {error && <div className="register-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="register-form">
                        {/* Nom d'utilisateur */}
                        <div className="form-group">
                            <label>
                                <User size={16} />
                                {t('username')} *
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder={t('username')}
                                required
                            />
                        </div>

                        {/* Mot de passe */}
                        <div className="form-group">
                            <label>
                                <Lock size={16} />
                                {t('password')} *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t('password')}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label>
                                <Mail size={16} />
                                {t('email')}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exemple@email.com"
                            />
                        </div>

                        {/* Prénom (ligne séparée) */}
                        <div className="form-group">
                            <label>{t('firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder={t('firstName')}
                            />
                        </div>

                        {/* Nom (ligne séparée) */}
                        <div className="form-group">
                            <label>{t('lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder={t('lastName')}
                            />
                        </div>

                        <button type="submit" className="register-button">
                            {t('register')} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="login-prompt">
                        {t('haveAccount')}{' '}
                        <button onClick={onSwitchToLogin} className="login-link">
                            {t('login')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;