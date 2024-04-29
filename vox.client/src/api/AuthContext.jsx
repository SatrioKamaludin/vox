import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const existingToken = localStorage.getItem('token');
    const existingId = localStorage.getItem('id');
    const existingEmail = localStorage.getItem('email');
    const [isLoggedIn, setIsLoggedIn] = useState(!!existingToken);
    const [token, setToken] = useState(existingToken);
    const [id, setId] = useState(existingId); 
    const [email, setEmail] = useState(existingEmail); 

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, token, setToken, id, setId, email, setEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
