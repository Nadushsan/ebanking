import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import apiService from '../services/apiService';
import { format, parseISO } from 'date-fns';

function TransactionChart({ accountId }) {
    const { t } = useLanguage();
    const [balanceHistory, setBalanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (accountId) {
            loadData();
        }
    }, [accountId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Récupérer l'historique des transactions
            const historyResponse = await apiService.getTransactionHistory(accountId);
            const txData = historyResponse.data;
            
            // Récupérer le solde actuel
            const accountResponse = await apiService.getAccount(accountId);
            const currentAccountBalance = accountResponse.data.balance;

            // Trier les transactions par date
            const sortedTx = [...txData].sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
            );

            // Construire l'historique du solde
            const balanceData = [];
            let runningBalance = 0;
            
            // Calculer le solde initial
            if (sortedTx.length > 0) {
                let tempBalance = currentAccountBalance;
                for (let i = sortedTx.length - 1; i >= 0; i--) {
                    const tx = sortedTx[i];
                    if (tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') {
                        tempBalance -= tx.amount;
                    } else if (tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER_OUT') {
                        tempBalance += tx.amount;
                    }
                }
                runningBalance = tempBalance;
            }

            // Ajouter le point de départ
            balanceData.push({
                date: sortedTx.length > 0 ? format(parseISO(sortedTx[0].timestamp), 'dd/MM') : format(new Date(), 'dd/MM'),
                balance: runningBalance
            });

            // Ajouter chaque transaction
            for (const tx of sortedTx) {
                if (tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') {
                    runningBalance += tx.amount;
                } else if (tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER_OUT') {
                    runningBalance -= tx.amount;
                }
                
                balanceData.push({
                    date: format(parseISO(tx.timestamp), 'dd/MM'),
                    balance: runningBalance
                });
            }

            setBalanceHistory(balanceData);
        } catch (error) {
            console.error('Erreur chargement données:', error);
            setError('Impossible de charger les données');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="chart-loading">
                <div className="spinner"></div>
                <p>{t('loading')}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chart-error">
                <p>{error}</p>
            </div>
        );
    }

    if (balanceHistory.length === 0) {
        return (
            <div className="chart-empty">
                <p>Aucune donnée disponible</p>
            </div>
        );
    }

    return (
        <div className="transaction-charts">
            <h3>{t('balanceEvolution')}</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={balanceHistory}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#00ff88', color: '#fff' }}
                            formatter={(value) => [`${value} XOF`, t('balance')]}
                        />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="#00ff88" 
                            fillOpacity={1} 
                            fill="url(#colorBalance)" 
                            name={t('balance')}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TransactionChart;