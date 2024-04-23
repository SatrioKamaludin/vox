import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import Organizer from './Organizer';
import User from './User';
import PrivateRoute from '../api/PrivateRoute';
import PublicRoute from '../api/PublicRoute';

function Navigation() {
    return (
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/organizers" element={<PrivateRoute><Organizer /></PrivateRoute>} />
                <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
                <Route path="/" element={<PublicRoute><Navigate to="/login" /></PublicRoute>} />
            </Routes>
    );
}

export default Navigation;
