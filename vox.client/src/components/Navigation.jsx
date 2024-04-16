import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function Navigation() {
    return (
        <div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default Navigation;
