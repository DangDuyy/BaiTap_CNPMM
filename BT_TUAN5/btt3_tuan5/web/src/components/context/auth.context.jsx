import { createContext, useContext } from 'react';

export const AuthContext = createContext({
    auth: {
        isAuthenticated: false,
        user: {
            email: "",
            name: ""
        }
    },
    setAuth: () => {},
    appLoading: true,
    setAppLoading: () => {}
});

// Add this new hook export while keeping existing code
export const useAuth = () => {
    const context = useContext(AuthContext);
    return {
        isAuthenticated: context.auth.isAuthenticated,
        user: context.auth.user,
        setAuth: context.setAuth,
        appLoading: context.appLoading,
        setAppLoading: context.setAppLoading
    };
};