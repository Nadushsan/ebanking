import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ArrowRight, Smartphone, Mail } from 'lucide-react';
import authService from '../services/authService';

function TwoFactorVerify({ username, onSuccess, onCancel }) {
    const { t } = useLanguage();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError('Code expiré. Veuillez réessayer.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleChange = (index, value) => {
        if (value.length > 1) return;
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }

        if (newCode.every(digit => digit) && !newCode.includes('')) {
            handleSubmit(newCode.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (fullCode) => {
        if (!fullCode) {
            fullCode = code.join('');
        }

        if (fullCode.length !== 6) {
            setError('Veuillez entrer un code à 6 chiffres');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('📤 Envoi du code 2FA pour:', username);
            console.log('📤 Code:', fullCode);
            
            const response = await authService.verifyTwoFactor(username, fullCode);
            console.log('✅ Réponse 2FA reçue:', response);
            onSuccess(response);
        } catch (err) {
            console.error('❌ Erreur 2FA:', err);
            console.error('❌ Détails:', err.response?.data);
            setError(err.response?.data?.message || 'Code invalide');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('📤 Demande de renvoi de code pour:', username);
            await authService.resendTwoFactorCode(username);
            setTimeLeft(300);
            console.log('✅ Code renvoyé avec succès');
        } catch (err) {
            console.error('❌ Erreur renvoi code:', err);
            setError('Erreur lors de l\'envoi du code');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="login-page">
            <div className="login-hero">
                <div className="login-hero-content">
                    <h1>Vérification à deux facteurs</h1>
                    <p className="hero-subtitle">
                        Un code de vérification a été envoyé à votre adresse email
                    </p>
                    
                    <div className="login-features">
                        <div className="feature-item">
                            <Shield size={24} />
                            <div>
                                <strong>Sécurité renforcée</strong>
                                <span>Protection supplémentaire</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Mail size={24} />
                            <div>
                                <strong>Email sécurisé</strong>
                                <span>Code à usage unique</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Smartphone size={24} />
                            <div>
                                <strong>Valable 5 minutes</strong>
                                <span>Expire dans {formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-form-wrapper">
                <div className="login-form-container">
                    <h2>Code de vérification</h2>
                    <p className="form-subtitle">
                        Entrez le code à 6 chiffres
                    </p>

                    {error && <div className="login-error">{error}</div>}

                    <div className="two-factor-code-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="code-input"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    <div className="timer-display">
                        Temps restant : {formatTime(timeLeft)}
                    </div>

                    <button
                        onClick={() => handleSubmit()}
                        className="login-button"
                        disabled={loading || code.includes('')}
                    >
                        {loading ? 'Vérification...' : 'Vérifier'} <ArrowRight size={18} />
                    </button>

                    <div className="register-prompt">
                        <button
                            onClick={handleResendCode}
                            className="register-link"
                            disabled={loading}
                        >
                            Renvoyer le code
                        </button>
                        {' • '}
                        <button
                            onClick={onCancel}
                            className="register-link"
                            disabled={loading}
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TwoFactorVerify;