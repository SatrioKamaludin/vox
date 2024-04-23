import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/user');
        }
    }, [isLoggedIn, navigate]);

    if (isLoggedIn) {
        return null;
    }

    return children;
};

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;
