import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AuthProvider } from './api/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navigation />
            </AuthProvider>
        </Router>
    );
}

export default App;
