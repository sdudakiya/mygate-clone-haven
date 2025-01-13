import React from 'react';
import { useAuth } from "./AuthContext";

function TestAuth() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
    return <div>Loading...</div>;
    }

    if (user) {
    return <div>User is logged in: {user.email}</div>;
    } else {
    return <div>User is not logged in.</div>;
    }
}

export default TestAuth;
