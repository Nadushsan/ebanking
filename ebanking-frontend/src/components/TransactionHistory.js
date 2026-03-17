import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowUpRight, ArrowDownLeft, Clock, Filter } from 'lucide-react';
import apiService from '../services/apiService';

function TransactionHistory({ accountId }) {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, sent, received

    useEffect(() => {
        if (accountId) {
            loadTransactions();
        }
    }, [accountId]);

    const loadTransactions = async () => {
        try {
            const response = await apiService.getTransactionHistory(accountId);
            // Filtrer uniquement les transferts
            const transfers = response.data.filter(tx => 
                tx.type === 'TRANSFER_OUT' || tx.type === 'TRANSFER_IN'
            );
            setTransactions(transfers);
        } catch (error) {
            console.error('Erreur chargement historique:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'sent') return tx.type === 'TRANSFER_OUT';
        if (filter === 'received') return tx.type === 'TRANSFER_IN';
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="history-loading">
            <Clock size={24} />
            <p>{t('loading')}</p>
        </div>
    );

    return (
        <div className="history-container">
            {/* En-tête avec filtre */}
            <div className="history-header">
                <div className="filter-label">
                    <Filter size={16} />
                    <span>{t('filterBy')} :</span>
                </div>
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        {t('all')} ({transactions.length})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
                        onClick={() => setFilter('sent')}
                    >
                        {t('sent')} ({transactions.filter(t => t.type === 'TRANSFER_OUT').length})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'received' ? 'active' : ''}`}
                        onClick={() => setFilter('received')}
                    >
                        {t('received')} ({transactions.filter(t => t.type === 'TRANSFER_IN').length})
                    </button>
                </div>
            </div>

            {/* Liste des transactions */}
            <div className="transactions-list">
                {filteredTransactions.length === 0 ? (
                    <div className="no-transactions">
                        <p>{t('noTransactions')}</p>
                    </div>
                ) : (
                    filteredTransactions.map((tx, index) => (
                        <React.Fragment key={tx.id}>
                            <div className={`transaction-item ${tx.type.toLowerCase()}`}>
                                <div className="transaction-icon">
                                    {tx.type === 'TRANSFER_OUT' ? (
                                        <ArrowUpRight size={20} />
                                    ) : (
                                        <ArrowDownLeft size={20} />
                                    )}
                                </div>
                                <div className="transaction-details">
                                    <div className="transaction-header">
                                        <span className="transaction-type">
                                            {tx.type === 'TRANSFER_OUT' ? t('transferSent') : t('transferReceived')}
                                        </span>
                                        <span className={`transaction-amount ${tx.type === 'TRANSFER_OUT' ? 'negative' : 'positive'}`}>
                                            {tx.type === 'TRANSFER_OUT' ? '- ' : '+ '}
                                            {tx.amount} {tx.currency}
                                        </span>
                                    </div>
                                    <div className="transaction-meta">
                                        <span className="transaction-date">
                                            <Calendar size={14} />
                                            {formatDate(tx.timestamp)}
                                        </span>
                                        {tx.description && (
                                            <span className="transaction-desc">
                                                {tx.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {index < filteredTransactions.length - 1 && (
                                <div className="transaction-separator"></div>
                            )}
                        </React.Fragment>
                    ))
                )}
            </div>
        </div>
    );
}

export default TransactionHistory;