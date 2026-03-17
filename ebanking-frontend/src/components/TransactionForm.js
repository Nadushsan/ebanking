import React, { useState } from 'react';
import apiService from '../services/apiService';
import { ArrowRight } from 'lucide-react';

function TransactionForm({ accountId, onTransaction }) {
    const [mode, setMode] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'deposit') {
                await apiService.deposit(accountId, amount, description);
                setMessage('Dépôt effectué avec succès');
            } else if (mode === 'withdraw') {
                await apiService.withdraw(accountId, amount, description);
                setMessage('Retrait effectué avec succès');
            } else if (mode === 'transfer') {
                if (!toAccountNumber) {
                    setMessage('Veuillez entrer un numéro de compte destinataire');
                    return;
                }
                await apiService.transfer(accountId, toAccountNumber, amount, description);
                setMessage('Virement effectué avec succès');
            }
            onTransaction();
            setAmount('');
            setDescription('');
            setToAccountNumber('');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Erreur : ' + (err.response?.data?.message || err.message));
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="transaction-form-container">
            <h3>Nouvelle opération</h3>
            
            {/* Boutons de sélection du mode */}
            <div className="transaction-mode-tabs">
                <button 
                    type="button"
                    onClick={() => setMode('deposit')} 
                    className={`mode-tab ${mode === 'deposit' ? 'active' : ''}`}
                >
                    Dépôt
                </button>
                <button 
                    type="button"
                    onClick={() => setMode('withdraw')} 
                    className={`mode-tab ${mode === 'withdraw' ? 'active' : ''}`}
                >
                    Retrait
                </button>
                <button 
                    type="button"
                    onClick={() => setMode('transfer')} 
                    className={`mode-tab ${mode === 'transfer' ? 'active' : ''}`}
                >
                    Transfert
                </button>
            </div>

            {/* Message de confirmation/erreur */}
            {message && <div className="transaction-message">{message}</div>}

            <form onSubmit={handleSubmit} className="transaction-form">
                {/* Champ destinataire (visible seulement pour transfert) */}
                {mode === 'transfer' && (
                    <div className="form-group">
                        <label>Compte destinataire</label>
                        <input
                            type="text"
                            value={toAccountNumber}
                            onChange={(e) => setToAccountNumber(e.target.value)}
                            placeholder="Numéro du compte destinataire"
                            className="transaction-input"
                            required
                        />
                    </div>
                )}

                {/* Montant et Description sur la même ligne */}
                <div className="transaction-row">
                    <div className="form-group">
                        <label>Montant</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="transaction-input"
                            required
                            min="1"
                            step="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description (optionnelle)"
                            className="transaction-input"
                        />
                    </div>
                </div>

                {/* Bouton Effectuer */}
                <button type="submit" className="transaction-submit-btn">
                    Effectuer <ArrowRight size={18} />
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;