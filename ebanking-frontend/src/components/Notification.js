// src/components/Notification.js
import React, { useEffect, useState } from 'react';

const Notification = ({ type, title, message, amount, currency, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch(type) {
            case 'success': return '✓';
            case 'error': return '✗';
            case 'info': return 'ℹ';
            default: return '•';
        }
    };

    return (
        <div className={`notification ${type} ${isExiting ? 'exit' : ''}`}>
            <div className="notification-icon">{getIcon()}</div>
            <div className="notification-content">
                <div className="notification-title">{title}</div>
                <div className="notification-message">
                    {message}
                    {amount && <span className="notification-amount"> {amount} {currency}</span>}
                </div>
            </div>
            <div className="notification-close" onClick={() => {
                setIsExiting(true);
                setTimeout(onClose, 300);
            }}>✕</div>
        </div>
    );
};

export default Notification;