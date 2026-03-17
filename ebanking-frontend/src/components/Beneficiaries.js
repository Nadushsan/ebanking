import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, User, Phone, Mail, Trash2, Edit, Check, X, CreditCard } from 'lucide-react';

function Beneficiaries({ accountId, beneficiaries: externalBeneficiaries, onBeneficiariesChange }) {
    const { t } = useLanguage();
    const [beneficiaries, setBeneficiaries] = useState(externalBeneficiaries || []);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Formulaire d'ajout/édition
    const [formData, setFormData] = useState({
        name: '',
        accountNumber: '',
        bankName: '',
        email: '',
        phone: ''
    });

    // Mettre à jour l'état local quand les props changent
    useEffect(() => {
        setBeneficiaries(externalBeneficiaries || []);
    }, [externalBeneficiaries]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddBeneficiary = (e) => {
        e.preventDefault();
        
        const newBeneficiary = {
            id: Date.now(),
            ...formData
        };
        
        const updatedBeneficiaries = [...beneficiaries, newBeneficiary];
        setBeneficiaries(updatedBeneficiaries);
        
        // Notifier le parent du changement
        if (onBeneficiariesChange) {
            onBeneficiariesChange(updatedBeneficiaries);
        }
        
        resetForm();
        setShowAddForm(false);
    };

    const handleEditBeneficiary = (beneficiary) => {
        setEditingId(beneficiary.id);
        setFormData({
            name: beneficiary.name,
            accountNumber: beneficiary.accountNumber,
            bankName: beneficiary.bankName,
            email: beneficiary.email || '',
            phone: beneficiary.phone || ''
        });
    };

    const handleUpdateBeneficiary = (e) => {
        e.preventDefault();
        
        const updatedBeneficiaries = beneficiaries.map(b => 
            b.id === editingId ? { ...b, ...formData } : b
        );
        
        setBeneficiaries(updatedBeneficiaries);
        
        // Notifier le parent du changement
        if (onBeneficiariesChange) {
            onBeneficiariesChange(updatedBeneficiaries);
        }
        
        resetForm();
        setEditingId(null);
    };

    const handleDeleteBeneficiary = (id) => {
        if (window.confirm(t('confirmDelete'))) {
            const updatedBeneficiaries = beneficiaries.filter(b => b.id !== id);
            setBeneficiaries(updatedBeneficiaries);
            
            // Notifier le parent du changement
            if (onBeneficiariesChange) {
                onBeneficiariesChange(updatedBeneficiaries);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            accountNumber: '',
            bankName: '',
            email: '',
            phone: ''
        });
        setEditingId(null);
    };

    const cancelEdit = () => {
        resetForm();
        setEditingId(null);
        setShowAddForm(false);
    };

    if (loading) {
        return (
            <div className="beneficiaries-loading">
                <div className="spinner"></div>
                <p>{t('loading')}...</p>
            </div>
        );
    }

    return (
        <div className="beneficiaries-container">
            {/* En-tête */}
            <div className="beneficiaries-header">
                <h3>{t('beneficiaries')}</h3>
                <button 
                    className="add-beneficiary-btn"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <UserPlus size={18} />
                    <span>{t('addBeneficiary')}</span>
                </button>
            </div>

            {/* Formulaire d'ajout/édition */}
            {(showAddForm || editingId) && (
                <div className="beneficiary-form">
                    <h4>{editingId ? t('editBeneficiary') : t('newBeneficiary')}</h4>
                    <form onSubmit={editingId ? handleUpdateBeneficiary : handleAddBeneficiary}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('name')} *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t('enterName')}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('accountNumber')} *</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                    placeholder={t('enterAccountNumber')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('bankName')}</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    placeholder={t('enterBankName')}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t('enterEmail')}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('phone')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder={t('enterPhone')}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-btn">
                                    <Check size={16} />
                                    {t('save')}
                                </button>
                                <button type="button" className="cancel-btn" onClick={cancelEdit}>
                                    <X size={16} />
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des bénéficiaires */}
            <div className="beneficiaries-list">
                {beneficiaries.length === 0 ? (
                    <div className="no-beneficiaries">
                        <User size={48} />
                        <p>{t('noBeneficiaries')}</p>
                        <button 
                            className="add-first-btn"
                            onClick={() => setShowAddForm(true)}
                        >
                            {t('addFirstBeneficiary')}
                        </button>
                    </div>
                ) : (
                    beneficiaries.map(beneficiary => (
                        <div key={beneficiary.id} className="beneficiary-card">
                            <div className="beneficiary-avatar">
                                <User size={24} />
                            </div>
                            
                            <div className="beneficiary-info">
                                <h4>{beneficiary.name}</h4>
                                <div className="beneficiary-details">
                                    <p className="account-detail">
                                        <CreditCard size={14} />
                                        {beneficiary.accountNumber}
                                    </p>
                                    {beneficiary.bankName && (
                                        <p className="bank-detail">
                                            {beneficiary.bankName}
                                        </p>
                                    )}
                                    {beneficiary.email && (
                                        <p className="contact-detail">
                                            <Mail size={14} />
                                            {beneficiary.email}
                                        </p>
                                    )}
                                    {beneficiary.phone && (
                                        <p className="contact-detail">
                                            <Phone size={14} />
                                            {beneficiary.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="beneficiary-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleEditBeneficiary(beneficiary)}
                                    title={t('edit')}
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                                    title={t('delete')}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Beneficiaries;