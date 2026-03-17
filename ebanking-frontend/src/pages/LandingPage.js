import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, TrendingUp, Users, CreditCard, GraduationCap, Mail, Phone, FileText, ChevronDown } from 'lucide-react';

function LandingPage({ onGetStarted, onLoginClick }) {
    const { t, currentLang, changeLanguage } = useLanguage();
    const [showMenu, setShowMenu] = useState(null);

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' }
    ];

    return (
        <div className="landing">
            <header className="landing-header">
                <div className="logo">ebanking</div>
                <nav className="nav-links">
                    {/* Menu Solutions */}
                    <div className="menu-container">
                        <button 
                            className="menu-trigger"
                            onClick={() => setShowMenu(showMenu === 'solutions' ? null : 'solutions')}
                        >
                            {t('ourSolution')} <ChevronDown size={16} />
                        </button>
                        {showMenu === 'solutions' && (
                            <div className="dropdown-menu">
                                <div className="menu-section">
                                    <h4>🌐 {t('language')}</h4>
                                    <div className="language-buttons">
                                        {languages.map(lang => (
                                            <button
                                                key={lang.code}
                                                className={`language-btn ${currentLang === lang.code ? 'active' : ''}`}
                                                onClick={() => {
                                                    changeLanguage(lang.code);
                                                    setShowMenu(null);
                                                }}
                                            >
                                                <span>{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="menu-section">
                                    <h4>📞 {t('ourContact')}</h4>
                                    <div className="contact-info">
                                        <div className="contact-item">
                                            <Mail size={16} />
                                            <span>support@ebanking.com</span>
                                        </div>
                                        <div className="contact-item">
                                            <Mail size={16} />
                                            <span>contact@ebanking.com</span>
                                        </div>
                                        <div className="contact-item">
                                            <Phone size={16} />
                                            <span>+212 5 37 77 10 10</span>
                                        </div>
                                        <div className="contact-item">
                                            <Phone size={16} />
                                            <span>+212 5 37 77 11 11</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="menu-section">
                                    <h4>🔒 {t('privacyRules')}</h4>
                                    <div className="privacy-links">
                                        <button className="privacy-link">
                                            <FileText size={16} />
                                            {t('privacyPolicy')}
                                        </button>
                                        <button className="privacy-link">
                                            <FileText size={16} />
                                            {t('termsOfUse')}
                                        </button>
                                        <button className="privacy-link">
                                            <FileText size={16} />
                                            {t('dataProtection')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Menu Company */}
                    <div className="menu-container">
                        <button 
                            className="menu-trigger"
                            onClick={() => setShowMenu(showMenu === 'company' ? null : 'company')}
                        >
                            {t('company')} <ChevronDown size={16} />
                        </button>
                        {showMenu === 'company' && (
                            <div className="dropdown-menu">
                                <div className="menu-section">
                                    <h4>{t('about')}</h4>
                                    <button className="menu-item">{t('ourStory')}</button>
                                    <button className="menu-item">{t('team')}</button>
                                    <button className="menu-item">{t('careers')}</button>
                                </div>
                                <div className="menu-section">
                                    <h4>{t('press')}</h4>
                                    <button className="menu-item">{t('pressReleases')}</button>
                                    <button className="menu-item">{t('media')}</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Menu Resources */}
                    <div className="menu-container">
                        <button 
                            className="menu-trigger"
                            onClick={() => setShowMenu(showMenu === 'resources' ? null : 'resources')}
                        >
                            {t('resources')} <ChevronDown size={16} />
                        </button>
                        {showMenu === 'resources' && (
                            <div className="dropdown-menu">
                                <div className="menu-section">
                                    <h4>{t('documentation')}</h4>
                                    <button className="menu-item">{t('apiGuide')}</button>
                                    <button className="menu-item">{t('techDocs')}</button>
                                    <button className="menu-item">{t('tutorials')}</button>
                                </div>
                                <div className="menu-section">
                                    <h4>{t('support')}</h4>
                                    <button className="menu-item">{t('helpCenter')}</button>
                                    <button className="menu-item">{t('faq')}</button>
                                    <button className="menu-item">{t('contactSupport')}</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="login-btn" onClick={onLoginClick}>{t('login')}</button>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="hero">
                <div className="hero-content">
                    <h1>{t('heroTitle')}</h1>
                    <p>{t('heroSubtitle')}</p>
                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={onGetStarted}>
                            {t('getStarted')} <ArrowRight size={18} />
                        </button>
                        <button className="btn-secondary">
                            {t('watchVideo')}
                        </button>
                    </div>
                </div>
                
                <div className="cards-showcase">
                    {/* Première carte */}
                    <div className="card-container card-1">
                        <div className="credit-card-modern card-dark">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <div className="card-header">
                                    <div className="card-chip"></div>
                                    <div className="card-type">VISA</div>
                                </div>
                                <div className="card-number">4804 9556 8008 8300</div>
                                <div className="card-footer">
                                    <div className="card-holder">
                                        <span className="label">{t('cardHolder')}</span>
                                        <span className="value">PRATHAM CHAVAN</span>
                                    </div>
                                    <div className="card-expiry">
                                        <span className="label">{t('expires')}</span>
                                        <span className="value">01/25</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deuxième carte */}
                    <div className="card-container card-2">
                        <div className="credit-card-modern card-green-black">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <div className="card-header">
                                    <div className="card-chip"></div>
                                    <div className="card-type">VISA</div>
                                </div>
                                <div className="card-number">5294 2436 4780 2468</div>
                                <div className="card-footer">
                                    <div className="card-holder">
                                        <span className="label">{t('cardHolder')}</span>
                                        <span className="value">JOHN DOE</span>
                                    </div>
                                    <div className="card-expiry">
                                        <span className="label">{t('expires')}</span>
                                        <span className="value">12/25</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Users size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>500K+</h3>
                            <p>{t('businessUsing')}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <TrendingUp size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>20M+</h3>
                            <p>{t('transactionsPerMonth')}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <CreditCard size={32} />
                        </div>
                        <div className="stat-content">
                            <h3>80%+</h3>
                            <p>{t('onlineUsers')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* School Section */}
            <div className="school-section">
                <h2>{t('ourSchool')}</h2>
                <div className="school-grid">
                    <div className="school-card">
                        <div className="school-icon">
                            <GraduationCap size={48} />
                        </div>
                        <div className="school-name">
                            {t('inpt')}
                        </div>
                    </div>
                    <div className="school-card">
                        <div className="school-icon">
                            <GraduationCap size={48} />
                        </div>
                        <div className="school-name">
                            {t('sesnum')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;