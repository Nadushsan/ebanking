import React, { createContext, useState, useContext } from 'react';

const translations = {
    fr: {
        // Header
        ourSolution: 'Notre solution',
        company: 'Entreprise',
        resources: 'Ressources',
        login: 'Connexion',
        
        // Hero
        heroTitle: 'Une solution de paiement complète conçue pour votre entreprise',
        heroSubtitle: 'Acceptez les paiements et envoyez des fonds facilement avec ebanking. Choisissez une solution simple pour gérer tous vos processus de paiement afin de vous concentrer sur le développement de votre entreprise.',
        getStarted: 'Commencer',
        watchVideo: 'Voir la vidéo',
        
        // Cartes
        cardHolder: 'TITULAIRE',
        expires: 'EXPIRATION',
        
        // Stats
        businessUsing: 'Entreprises utilisant ebanking',
        transactionsPerMonth: 'Transactions traitées par mois',
        onlineUsers: 'Utilisateurs en ligne',
        
        // École
        ourSchool: 'Notre école',
        inpt: 'Institut National des Postes et Télécommunications Rabat',
        sesnum: 'SESNUM INE2',
        
        // Menu
        language: 'Langue',
        ourContact: 'Notre contact',
        privacyRules: 'Règles de confidentialité',
        privacyPolicy: 'Politique de confidentialité',
        termsOfUse: 'Conditions d\'utilisation',
        dataProtection: 'Protection des données',
        about: 'À propos',
        ourStory: 'Notre histoire',
        team: 'Équipe',
        careers: 'Carrières',
        press: 'Presse',
        pressReleases: 'Communiqués',
        media: 'Médias',
        documentation: 'Documentation',
        apiGuide: 'Guide API',
        techDocs: 'Documentation technique',
        tutorials: 'Tutoriels',
        support: 'Support',
        helpCenter: 'Centre d\'aide',
        faq: 'FAQ',
        contactSupport: 'Contact support',
        
        // Login
        welcome: 'Bienvenue sur ebanking',
        loginSubtitle: 'Accédez à votre espace sécurisé',
        secure: 'Sécurisé',
        encryptedTransactions: 'Transactions chiffrées',
        fast: 'Rapide',
        instantTransfers: 'Transferts instantanés',
        available: 'Disponible',
        '247': '24h/24 7j/7',
        username: 'Nom d\'utilisateur',
        password: 'Mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié ?',
        noAccount: 'Pas encore de compte ?',
        haveAccount: 'Déjà un compte ?',
        register: 'S\'inscrire',
        usernamePasswordIncorrect: 'Nom d\'utilisateur ou mot de passe incorrect',
        accessSecureSpace: 'Accédez à votre espace sécurisé',
        
        // Register
        createAccount: 'Créez votre compte',
        registerSubtitle: 'Rejoignez ebanking pour gérer vos paiements facilement',
        registrationSuccess: 'Inscription réussie !',
        registrationError: 'Erreur lors de l\'inscription',
        simplifiedManagement: 'Gestion simplifiée de vos comptes',
        secureTransactions: 'Transactions sécurisées',
        support247: 'Support client 24h/24',
        createPersonalSpace: 'Créez votre espace personnel',
        email: 'Email',
        firstName: 'Prénom',
        lastName: 'Nom',
        
        // Dashboard
        logout: 'Déconnexion',
        yourAccounts: 'Vos comptes',
        createNewAccount: 'Créer un nouveau compte',
        newAccount: 'Nouveau compte',
        accountType: 'Type de compte',
        currency: 'Devise',
        create: 'Créer',
        current: 'Courant',
        savings: 'Épargne',
        noAccounts: 'Aucun compte pour le moment',
        availableBalance: 'SOLDE DISPONIBLE',
        send: 'Envoyer',
        receive: 'Recevoir',
        analyze: 'Analyser',
        newOperation: 'Nouvelle opération',
        deposit: 'Dépôt',
        withdrawal: 'Retrait',
        transfer: 'Transfert',
        amount: 'Montant',
        description: 'Description',
        descriptionOptional: 'Description (optionnelle)',
        execute: 'Effectuer',
        recipientAccount: 'Numéro de compte destinataire',
        financialAnalysis: 'Analyses financières',
        balanceEvolution: 'Évolution du solde',
        distribution: 'Répartition',
        dailyVolume: 'Volume quotidien',
        noAccountSelected: 'Aucun compte sélectionné',
        createOrSelectAccount: 'Créez un compte ou sélectionnez-en un dans la liste',
        deposits: 'Dépôts',
        withdrawals: 'Retraits',
        transfersSent: 'Virements envoyés',
        transfersReceived: 'Virements reçus',
        balance: 'Solde',
        noData: 'Aucune donnée disponible',

        // Dans la section 'fr'
history: 'Historique',
beneficiaries: 'Bénéficiaires',
newTransfer: 'Nouveau transfert',
fromAccount: 'Compte source',
toAccount: 'Compte destinataire',
enterAccountNumber: 'Entrez le numéro de compte',
executeTransfer: 'Effectuer le transfert',
transferHistory: 'Historique des transferts',
all: 'Tous',
sent: 'Envoyés',
received: 'Reçus',
noTransactions: 'Aucune transaction',
transferSent: 'Transfert envoyé',
transferReceived: 'Transfert reçu',
loading: 'Chargement...',
addBeneficiary: 'Ajouter un bénéficiaire',
editBeneficiary: 'Modifier le bénéficiaire',
newBeneficiary: 'Nouveau bénéficiaire',
name: 'Nom',
bankName: 'Nom de la banque',
enterName: 'Entrez le nom',
enterBankName: 'Entrez le nom de la banque',
enterEmail: 'Entrez l\'email',
enterPhone: 'Entrez le téléphone',
save: 'Enregistrer',
cancel: 'Annuler',
delete: 'Supprimer',
edit: 'Modifier',
confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?',
noBeneficiaries: 'Aucun bénéficiaire enregistré',
addFirstBeneficiary: 'Ajouter un premier bénéficiaire',


        // Notifications
        error: 'Erreur',
        cantLoadAccounts: 'Impossible de charger vos comptes',
        accountCreated: 'Compte créé',
        accountCreatedMsg: 'Votre compte',
        in: 'en',
        cantCreateAccount: 'Impossible de créer le compte',
        invalidAmount: 'Montant invalide',
        enterValidAmount: 'Veuillez entrer un montant valide',
        operationRefused: 'Opération refusée',
        insufficientBalance: 'Solde insuffisant',
        currentBalance: 'Votre solde actuel est de',
        transferImpossible: 'Transfert impossible',
        enterRecipientAccount: 'Veuillez entrer un numéro de compte destinataire',
        transferRefused: 'Transfert refusé',
        insufficientBalanceForTransfer: 'Solde insuffisant pour effectuer ce transfert',
        depositSuccess: 'Dépôt effectué',
        depositMsg: 'Votre dépôt de',
        credited: 'a été crédité avec succès',
        withdrawalSuccess: 'Retrait effectué',
        withdrawalMsg: 'Votre retrait de',
        debited: 'a été débité avec succès',
        newBalance: 'Nouveau solde',
        transferSuccess: 'Transfert effectué',
        transferMsg: 'Votre transfert de',
        toAccount: 'vers le compte',
        completed: 'a été effectué',
        operationError: 'Erreur lors de l\'opération',
        recipientNotFound: 'Destinataire introuvable',
        accountNotFoundMsg: 'Le numéro de compte destinataire n\'existe pas',
        sameAccountMsg: 'Vous ne pouvez pas transférer vers le même compte'
    },
    
    en: {
        // Header
        ourSolution: 'Our solution',
        company: 'Company',
        resources: 'Resources',
        login: 'Login',
        
        // Hero
        heroTitle: 'A complete payment gateway solution designed for your business',
        heroSubtitle: 'Accept payments and send funds easily with ebanking. Choose an easy way to manage all payment processes so you can focus on growing your business.',
        getStarted: 'Get started',
        watchVideo: 'Watch video',
        
        // Cards
        cardHolder: 'CARD HOLDER',
        expires: 'EXPIRES',
        
        // Stats
        businessUsing: 'Businesses using ebanking',
        transactionsPerMonth: 'Transactions per month',
        onlineUsers: 'Online users',
        
        // School
        ourSchool: 'Our school',
        inpt: 'National Institute of Posts and Telecommunications Rabat',
        sesnum: 'SESNUM INE2',
        
        // Menu
        language: 'Language',
        ourContact: 'Our contact',
        privacyRules: 'Privacy rules',
        privacyPolicy: 'Privacy policy',
        termsOfUse: 'Terms of use',
        dataProtection: 'Data protection',
        about: 'About',
        ourStory: 'Our story',
        team: 'Team',
        careers: 'Careers',
        press: 'Press',
        pressReleases: 'Press releases',
        media: 'Media',
        documentation: 'Documentation',
        apiGuide: 'API guide',
        techDocs: 'Technical documentation',
        tutorials: 'Tutorials',
        support: 'Support',
        helpCenter: 'Help center',
        faq: 'FAQ',
        contactSupport: 'Contact support',
        addBeneficiary: 'Add beneficiary',
editBeneficiary: 'Edit beneficiary',
newBeneficiary: 'New beneficiary',
name: 'Name',
bankName: 'Bank name',
enterName: 'Enter name',
enterBankName: 'Enter bank name',
enterEmail: 'Enter email',
enterPhone: 'Enter phone',
save: 'Save',
cancel: 'Cancel',
delete: 'Delete',
edit: 'Edit',
confirmDelete: 'Are you sure you want to delete this beneficiary?',
noBeneficiaries: 'No beneficiaries saved',
addFirstBeneficiary: 'Add first beneficiary',
        
        // Login
        welcome: 'Welcome to ebanking',
        loginSubtitle: 'Access your secure space',
        secure: 'Secure',
        encryptedTransactions: 'Encrypted transactions',
        fast: 'Fast',
        instantTransfers: 'Instant transfers',
        available: 'Available',
        '247': '24/7',
        username: 'Username',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        noAccount: 'No account yet?',
        haveAccount: 'Already have an account?',
        register: 'Register',
        usernamePasswordIncorrect: 'Incorrect username or password',
        accessSecureSpace: 'Access your secure space',
        
        // Register
        createAccount: 'Create your account',
        registerSubtitle: 'Join ebanking to manage your payments easily',
        registrationSuccess: 'Registration successful!',
        registrationError: 'Registration error',
        simplifiedManagement: 'Simplified account management',
        secureTransactions: 'Secure transactions',
        support247: '24/7 customer support',
        createPersonalSpace: 'Create your personal space',
        email: 'Email',
        firstName: 'First name',
        lastName: 'Last name',
        
        // Dashboard
        logout: 'Logout',
        yourAccounts: 'Your accounts',
        createNewAccount: 'Create new account',
        newAccount: 'New account',
        accountType: 'Account type',
        currency: 'Currency',
        create: 'Create',
        current: 'Current',
        savings: 'Savings',
        noAccounts: 'No accounts yet',
        availableBalance: 'AVAILABLE BALANCE',
        send: 'Send',
        receive: 'Receive',
        analyze: 'Analyze',
        newOperation: 'New operation',
        deposit: 'Deposit',
        withdrawal: 'Withdrawal',
        transfer: 'Transfer',
        amount: 'Amount',
        description: 'Description',
        descriptionOptional: 'Description (optional)',
        execute: 'Execute',
        recipientAccount: 'Recipient account number',
        financialAnalysis: 'Financial analysis',
        balanceEvolution: 'Balance evolution',
        distribution: 'Distribution',
        dailyVolume: 'Daily volume',
        noAccountSelected: 'No account selected',
        createOrSelectAccount: 'Create an account or select one from the list',
        deposits: 'Deposits',
        withdrawals: 'Withdrawals',
        transfersSent: 'Transfers sent',
        transfersReceived: 'Transfers received',
        balance: 'Balance',
        noData: 'No data available',
// Dans la section 'en'
        history: 'History',
beneficiaries: 'Beneficiaries',
newTransfer: 'New transfer',
fromAccount: 'From account',
toAccount: 'To account',
enterAccountNumber: 'Enter account number',
executeTransfer: 'Execute transfer',
transferHistory: 'Transfer history',
all: 'All',
sent: 'Sent',
received: 'Received',
noTransactions: 'No transactions',
transferSent: 'Transfer sent',
transferReceived: 'Transfer received',
loading: 'Loading...',
        
        // Notifications
        error: 'Error',
        cantLoadAccounts: 'Unable to load your accounts',
        accountCreated: 'Account created',
        accountCreatedMsg: 'Your account',
        in: 'in',
        cantCreateAccount: 'Unable to create account',
        invalidAmount: 'Invalid amount',
        enterValidAmount: 'Please enter a valid amount',
        operationRefused: 'Operation refused',
        insufficientBalance: 'Insufficient balance',
        currentBalance: 'Your current balance is',
        transferImpossible: 'Transfer impossible',
        enterRecipientAccount: 'Please enter a recipient account number',
        transferRefused: 'Transfer refused',
        insufficientBalanceForTransfer: 'Insufficient balance for this transfer',
        depositSuccess: 'Deposit successful',
        depositMsg: 'Your deposit of',
        credited: 'has been credited successfully',
        withdrawalSuccess: 'Withdrawal successful',
        withdrawalMsg: 'Your withdrawal of',
        debited: 'has been debited successfully',
        newBalance: 'New balance',
        transferSuccess: 'Transfer successful',
        transferMsg: 'Your transfer of',
        toAccount: 'to account',
        completed: 'has been completed',
        operationError: 'Operation error',
        recipientNotFound: 'Recipient not found',
        accountNotFoundMsg: 'Recipient account number does not exist',
        sameAccountMsg: 'Cannot transfer to the same account'
    }
};

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState('fr');

    const t = (key) => {
        return translations[currentLang]?.[key] || translations.fr[key] || key;
    };

    const changeLanguage = (langCode) => {
        setCurrentLang(langCode);
    };

    const value = {
        currentLang,
        changeLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
