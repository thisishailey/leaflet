'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { firebaseApp } from '../config';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(firebaseApp);
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
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
