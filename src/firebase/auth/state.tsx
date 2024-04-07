'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuth } from '../config';
import { User, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext<{ user: User | null }>({ user: null });
export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div>{'Loading...'}</div> : children}
        </AuthContext.Provider>
    );
}
