import React from 'react';

function AccountList({ accounts, selectedAccount, onSelectAccount }) {
    return (
        <div className="account-list">
            <h3>Vos comptes</h3>
            {accounts.length === 0 ? (
                <p>Aucun compte trouvé</p>
            ) : (
                <ul>
                    {accounts.map(account => (
                        <li 
                            key={account.id}
                            className={selectedAccount?.id === account.id ? 'selected' : ''}
                            onClick={() => onSelectAccount(account)}
                        >
                            <div className="account-item">
                                <span className="account-number">{account.accountNumber}</span>
                                <span className="account-balance">{account.balance} {account.currency}</span>
                                <span className="account-type">{account.accountType}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AccountList;