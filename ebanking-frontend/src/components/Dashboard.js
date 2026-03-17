import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import TransactionChart from './TransactionChart';
import TransactionHistory from './TransactionHistory';
import Beneficiaries from './Beneficiaries';
import Notification from './Notification';
import { CreditCard, TrendingUp, LogOut, PlusCircle, Send, Download, Eye, ArrowRight, Users, History, ChevronDown, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; 

function Dashboard({ user, onLogout }) {
    const { t } = useLanguage();
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [newAccountType, setNewAccountType] = useState('COURANT');
    const [newCurrency, setNewCurrency] = useState('XOF');
    
    // État pour le transfert
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    
    // État pour les bénéficiaires
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [showBeneficiariesList, setShowBeneficiariesList] = useState(false);
    
    // État pour les notifications
    const [notifications, setNotifications] = useState([]);

    // État pour le type de graphique
    const [chartType, setChartType] = useState('balance');

    // État pour l'onglet actif
    const [activeTab, setActiveTab] = useState('transfer');

    // États pour la 2FA
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [setupMessage, setSetupMessage] = useState('');

    useEffect(() => {
        loadAccounts();
        loadBeneficiaries();
    }, [refresh]);

    useEffect(() => {
        if (selectedAccount) {
            refreshSelectedAccount();
            setFromAccountId(selectedAccount.id);
        }
    }, [refresh, selectedAccount]);

    const loadAccounts = async () => {
        try {
            const response = await apiService.getMyAccounts();
            setAccounts(response.data);
            if (response.data.length > 0 && !selectedAccount) {
                setSelectedAccount(response.data[0]);
                setFromAccountId(response.data[0].id);
            }
        } catch (err) {
            console.error('Erreur chargement comptes', err);
            addNotification('error', t('error'), t('cantLoadAccounts'));
        }
    };

    const loadBeneficiaries = () => {
        const savedBeneficiaries = localStorage.getItem('beneficiaries');
        if (savedBeneficiaries) {
            setBeneficiaries(JSON.parse(savedBeneficiaries));
        } else {
            const defaultBeneficiaries = [
                { id: 1, name: 'Jean Dupont', accountNumber: 'BNK123456789', bankName: 'Banque Populaire' },
                { id: 2, name: 'Marie Martin', accountNumber: 'BNK987654321', bankName: 'Attijariwafa Bank' },
                { id: 3, name: 'Pierre Durand', accountNumber: 'BNK456789123', bankName: 'BMCE' },
            ];
            setBeneficiaries(defaultBeneficiaries);
            localStorage.setItem('beneficiaries', JSON.stringify(defaultBeneficiaries));
        }
    };

    const refreshSelectedAccount = async () => {
        if (!selectedAccount) return;
        try {
            const response = await apiService.getAccount(selectedAccount.id);
            setSelectedAccount(response.data);
            setAccounts(prevAccounts => 
                prevAccounts.map(acc => 
                    acc.id === selectedAccount.id ? response.data : acc
                )
            );
        } catch (err) {
            console.error('Erreur rafraîchissement compte', err);
        }
    };

    // Gestion des notifications
    const addNotification = (type, title, message, amount = null, currency = null) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, title, message, amount, currency }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            await apiService.createAccount({ 
                accountType: newAccountType, 
                currency: newCurrency 
            });
            setShowCreateAccount(false);
            setRefresh(refresh + 1);
            addNotification('success', t('accountCreated'), `${t('accountCreatedMsg')} ${newAccountType} ${t('in')} ${newCurrency}`);
        } catch (err) {
            console.error('Erreur création compte', err);
            addNotification('error', t('error'), t('cantCreateAccount'));
        }
    };

    const selectBeneficiary = (beneficiary) => {
        setToAccountNumber(beneficiary.accountNumber);
        setShowBeneficiariesList(false);
        addNotification('info', 'Bénéficiaire sélectionné', `${beneficiary.name} - ${beneficiary.accountNumber}`);
    };

    const handleBeneficiariesChange = (updatedBeneficiaries) => {
        setBeneficiaries(updatedBeneficiaries);
        localStorage.setItem('beneficiaries', JSON.stringify(updatedBeneficiaries));
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!selectedAccount) return;

        if (!amount || parseFloat(amount) <= 0) {
            addNotification('error', t('invalidAmount'), t('enterValidAmount'));
            return;
        }

        const amountValue = parseFloat(amount);
        const currentBalance = selectedAccount.balance;
        const currency = selectedAccount.currency;

        if (!toAccountNumber) {
            addNotification('error', t('transferImpossible'), t('enterRecipientAccount'));
            return;
        }
        
        if (amountValue > currentBalance) {
            addNotification(
                'error', 
                t('transferRefused'), 
                `${t('insufficientBalanceForTransfer')} ${t('currentBalance')}: ${currentBalance} ${currency}`,
                currentBalance,
                currency
            );
            return;
        }

        try {
            await apiService.transfer(selectedAccount.id, toAccountNumber, amount, description);
            
            const beneficiary = beneficiaries.find(b => b.accountNumber === toAccountNumber);
            const beneficiaryName = beneficiary ? ` à ${beneficiary.name}` : '';
            
            addNotification(
                'success', 
                t('transferSuccess'), 
                `Transfert de ${amount} ${currency} vers ${toAccountNumber.slice(0, 8)}...${beneficiaryName} effectué avec succès`,
                amount,
                currency
            );
            
            setRefresh(refresh + 1);
            setAmount('');
            setDescription('');
            setToAccountNumber('');
            
        } catch (err) {
            let errorMessage = t('operationError');
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            if (errorMessage.toLowerCase().includes('solde insuffisant') || errorMessage.toLowerCase().includes('insufficient balance')) {
                addNotification(
                    'error', 
                    t('transferRefused'), 
                    `${t('insufficientBalance')} ${t('currentBalance')}: ${currentBalance} ${currency}`,
                    currentBalance,
                    currency
                );
            } else if (errorMessage.toLowerCase().includes('compte non trouvé') || errorMessage.toLowerCase().includes('account not found')) {
                addNotification(
                    'error', 
                    t('recipientNotFound'), 
                    t('accountNotFoundMsg')
                );
            } else if (errorMessage.toLowerCase().includes('même compte') || errorMessage.toLowerCase().includes('same account')) {
                addNotification(
                    'error', 
                    t('transferImpossible'), 
                    t('sameAccountMsg')
                );
            } else {
                addNotification('error', t('error'), errorMessage);
            }
        }
    };

    // Fonctions pour la 2FA
    const handleSetup2FA = async () => {
        try {
            const response = await apiService.setupTwoFactor(user.username);
            setQrCodeUrl(response.qrCodeUrl);
            setSecret(response.secret);
            setShow2FASetup(true);
            setSetupMessage('');
        } catch (err) {
            console.error('Erreur setup 2FA:', err);
            setSetupMessage('Erreur lors de l\'activation de la 2FA');
        }
    };

    const handleDisable2FA = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir désactiver la double authentification ?')) {
            try {
                await apiService.disableTwoFactor(user.username);
                setShow2FASetup(false);
                setQrCodeUrl('');
                setSecret('');
                addNotification('success', '2FA désactivée', 'La double authentification a été désactivée');
            } catch (err) {
                console.error('Erreur désactivation 2FA:', err);
                addNotification('error', 'Erreur', 'Impossible de désactiver la 2FA');
            }
        }
    };

    return (
        <div className="dashboard">
            {/* Notifications */}
            <div className="notification-container">
                {notifications.map(notif => (
                    <Notification
                        key={notif.id}
                        type={notif.type}
                        title={notif.title}
                        message={notif.message}
                        amount={notif.amount}
                        currency={notif.currency}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="dashboard-header">
                <div className="logo">ebanking</div>
                <div className="user-menu">
                    <div className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <span className="username">{user?.username || 'Demo'}</span>
                    
                    {/* Bouton 2FA */}
                    <button className="security-btn" onClick={handleSetup2FA} title="Activer la double authentification">
                        <Shield size={16} />
                        <span>2FA</span>
                    </button>
                    
                    <button className="logout-btn" onClick={onLogout}>
                        <LogOut size={16} />
                        <span>{t('logout')}</span>
                    </button>
                </div>
            </header>

            {/* Panneau de configuration 2FA */}
            {show2FASetup && (
                <div className="twofa-setup-panel">
                    <h3>Configurer l'authentification à deux facteurs</h3>
                    
                    {qrCodeUrl ? (
                        <div className="qr-code-container">
                            <img src={qrCodeUrl} alt="QR Code 2FA" />
                            <p>Scannez ce QR code avec Google Authenticator ou une application compatible</p>
                            <div className="secret-key">
                                <strong>Clé secrète :</strong> {secret}
                            </div>
                        </div>
                    ) : (
                        <p>Génération du QR code en cours...</p>
                    )}
                    
                    {setupMessage && <div className="setup-message">{setupMessage}</div>}
                    
                    <div className="twofa-actions">
                        <button className="cancel-btn" onClick={() => setShow2FASetup(false)}>
                            Fermer
                        </button>
                        <button className="disable-btn" onClick={handleDisable2FA}>
                            Désactiver la 2FA
                        </button>
                    </div>
                </div>
            )}

            {/* Contenu principal */}
            <div className="dashboard-content">
                {/* Sidebar - Liste des comptes */}
                <div className="dashboard-sidebar">
                    <div className="sidebar-header">
                        <h3>{t('yourAccounts')}</h3>
                        <button 
                            className="add-account-btn"
                            onClick={() => setShowCreateAccount(!showCreateAccount)}
                            title={t('createNewAccount')}
                        >
                            <PlusCircle size={18} />
                        </button>
                    </div>

                    {showCreateAccount && (
                        <div className="create-account-form">
                            <h4>{t('newAccount')}</h4>
                            <select 
                                value={newAccountType} 
                                onChange={(e) => setNewAccountType(e.target.value)}
                            >
                                <option value="COURANT">{t('current')}</option>
                                <option value="EPARGNE">{t('savings')}</option>
                            </select>
                            <select 
                                value={newCurrency} 
                                onChange={(e) => setNewCurrency(e.target.value)}
                            >
                                <option value="XOF">XOF</option>
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                            </select>
                            <button onClick={handleCreateAccount}>{t('create')}</button>
                        </div>
                    )}

                    <div className="accounts-list">
                        {accounts.length === 0 ? (
                            <p className="no-accounts-message">{t('noAccounts')}</p>
                        ) : (
                            accounts.map(account => (
                                <div 
                                    key={account.id}
                                    className={`account-card ${selectedAccount?.id === account.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedAccount(account)}
                                >
                                    <div className="account-card-header">
                                        <CreditCard size={16} />
                                        <span className="account-number">
                                            {account.accountNumber?.slice(0, 8)}...
                                        </span>
                                    </div>
                                    <div className="account-card-balance">
                                        {account.balance} {account.currency}
                                    </div>
                                    <div className="account-card-type">
                                        {account.accountType === 'COURANT' ? t('current') : t('savings')}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main content */}
                <div className="dashboard-main">
                    {selectedAccount ? (
                        <>
                            {/* Carte de crédit */}
                            <div className="credit-card-container">
                                <div className="credit-card">
                                    <div className="card-background"></div>
                                    <div className="card-content">
                                        <div className="card-header">
                                            <div className="card-chip"></div>
                                            <span className="card-brand">VISA</span>
                                        </div>
                                        <div className="card-number">
                                            {selectedAccount.accountNumber?.replace(/(.{4})/g, '$1 ')}
                                        </div>
                                        <div className="card-details">
                                            <div className="card-holder">
                                                <span className="label">{t('cardHolder')}</span>
                                                <span className="value">{user?.username?.toUpperCase() || 'DEMO'}</span>
                                            </div>
                                            <div className="card-expiry">
                                                <span className="label">{t('expires')}</span>
                                                <span className="value">12/25</span>
                                            </div>
                                        </div>
                                        <div className="card-balance">
                                            <span className="label">{t('availableBalance')}</span>
                                            <span className="balance-value">{selectedAccount.balance} {selectedAccount.currency}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Onglets de navigation */}
                            <div className="dashboard-tabs">
                                <button 
                                    className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('transfer')}
                                >
                                    <Send size={16} />
                                    <span>{t('transfer')}</span>
                                </button>
                                <button 
                                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('history')}
                                >
                                    <History size={16} />
                                    <span>{t('history')}</span>
                                </button>
                                <button 
                                    className={`tab-btn ${activeTab === 'beneficiaries' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('beneficiaries')}
                                >
                                    <Users size={16} />
                                    <span>{t('beneficiaries')}</span>
                                </button>
                                <button 
                                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('analytics')}
                                >
                                    <TrendingUp size={16} />
                                    <span>{t('analytics')}</span>
                                </button>
                            </div>

                            {/* Contenu des onglets */}
                            <div className="tab-content">
                                {/* Onglet Transfert */}
                                {activeTab === 'transfer' && (
                                    <div className="transfer-section">
                                        <h3>{t('newTransfer')}</h3>
                                        
                                        <form onSubmit={handleTransfer} className="transfer-form">
                                            <div className="form-group">
                                                <label>{t('fromAccount')}</label>
                                                <select 
                                                    value={fromAccountId} 
                                                    onChange={(e) => setFromAccountId(e.target.value)}
                                                    className="account-select"
                                                >
                                                    {accounts.map(account => (
                                                        <option key={account.id} value={account.id}>
                                                            {account.accountNumber} - {account.balance} {account.currency}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>{t('toAccount')}</label>
                                                <div className="beneficiary-input-container">
                                                    <input 
                                                        type="text" 
                                                        placeholder={t('enterAccountNumber')}
                                                        value={toAccountNumber}
                                                        onChange={(e) => setToAccountNumber(e.target.value)}
                                                        className="transfer-input"
                                                        required
                                                    />
                                                    {beneficiaries.length > 0 && (
                                                        <button 
                                                            type="button"
                                                            className="beneficiary-dropdown-btn"
                                                            onClick={() => setShowBeneficiariesList(!showBeneficiariesList)}
                                                        >
                                                            <Users size={18} />
                                                            <ChevronDown size={14} />
                                                        </button>
                                                    )}
                                                    
                                                    {showBeneficiariesList && beneficiaries.length > 0 && (
                                                        <div className="beneficiaries-dropdown">
                                                            {beneficiaries.map(b => (
                                                                <div 
                                                                    key={b.id}
                                                                    className="beneficiary-option"
                                                                    onClick={() => selectBeneficiary(b)}
                                                                >
                                                                    <div className="beneficiary-option-name">{b.name}</div>
                                                                    <div className="beneficiary-option-details">
                                                                        <span>{b.accountNumber}</span>
                                                                        {b.bankName && <span> • {b.bankName}</span>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>{t('amount')}</label>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        className="amount-input"
                                                        required
                                                        min="1"
                                                        step="1"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>{t('description')}</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder={t('descriptionOptional')}
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        className="desc-input"
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="submit-btn">
                                                {t('executeTransfer')} <ArrowRight size={16} />
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Onglet Historique */}
                                {activeTab === 'history' && (
                                    <div className="history-section">
                                        <h3>{t('transferHistory')}</h3>
                                        <TransactionHistory accountId={selectedAccount.id} />
                                    </div>
                                )}

                                {/* Onglet Bénéficiaires */}
                                {activeTab === 'beneficiaries' && (
                                    <div className="beneficiaries-section">
                                        <Beneficiaries 
                                            accountId={selectedAccount.id} 
                                            beneficiaries={beneficiaries}
                                            onBeneficiariesChange={handleBeneficiariesChange}
                                        />
                                    </div>
                                )}

                                {/* Onglet Analyses */}
                                {activeTab === 'analytics' && (
                                    <div className="analysis-section">
                                        <h3>{t('financialAnalysis')}</h3>
                                        <TransactionChart accountId={selectedAccount.id} />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="no-account">
                            <CreditCard size={48} />
                            <h3>{t('noAccountSelected')}</h3>
                            <p>{t('createOrSelectAccount')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;