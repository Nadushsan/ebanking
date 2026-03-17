import React, { useState } from 'react';
import apiService from '../services/apiService';

function CreateAccount({ onAccountCreated }) {
    const [accountType, setAccountType] = useState('COURANT');
    const [currency, setCurrency] = useState('XOF');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.createAccount({ accountType, currency });
            setMessage('Compte créé avec succès !');
            onAccountCreated();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Erreur lors de la création');
        }
    };

    return (
        <div className="create-account">
            <h3>Créer un compte</h3>
            {message && <div className="info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Type de compte</label>
                    <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                        <option value="COURANT">Courant</option>
                        <option value="EPARGNE">Épargne</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Devise</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="XOF">XOF (Franc CFA)</option>
                        <option value="EUR">Euro</option>
                        <option value="USD">Dollar US</option>
                    </select>
                </div>
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}

export default CreateAccount;