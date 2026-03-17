import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import authService from './services/authService';
import './App.css';

// Composant principal qui utilise le contexte
function AppContent() {
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setShowLogin(false);
        setShowRegister(false);
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const handleGetStarted = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    if (currentUser) {
        return <Dashboard user={currentUser} onLogout={handleLogout} />;
    }

    if (showRegister) {
        return <Register onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
        }} />;
    }

    if (showLogin) {
        return <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
            }} 
        />;
    }

    return <LandingPage 
        onGetStarted={handleGetStarted}
        onLoginClick={handleLoginClick}
    />;
}

// Composant racine avec le Provider
function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;