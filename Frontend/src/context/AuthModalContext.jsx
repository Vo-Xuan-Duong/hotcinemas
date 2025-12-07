import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

    const openAuthModal = (mode = 'login', redirectPath = null) => {
        setAuthModalMode(mode);
        setRedirectAfterLogin(redirectPath);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setRedirectAfterLogin(null);
    };

    const value = {
        isAuthModalOpen,
        authModalMode,
        redirectAfterLogin,
        openAuthModal,
        closeAuthModal
    };

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error('useAuthModal must be used within AuthModalProvider');
    }
    return context;
};
