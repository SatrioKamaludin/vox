import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const existingToken = localStorage.getItem('token');
    const [isLoggedIn, setIsLoggedIn] = useState(!!existingToken);
    const [token, setToken] = useState(existingToken);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
