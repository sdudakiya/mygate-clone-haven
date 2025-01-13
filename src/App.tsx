// App.tsx or App.jsx
import React from 'react';
import TestAuth from './contexts/TestAuth'; 
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
function App() {
    return (
        <AuthProvider>
             <TestAuth />
        </AuthProvider>
    )
}

export default App;
