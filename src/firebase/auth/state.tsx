'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config';
import { User, onAuthStateChanged } from 'firebase/auth';

type UserState = User | 'none' | 'loading';

const AuthContext = createContext<{ user: UserState }>({ user: 'loading' });
export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<UserState>('loading');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user || 'none');
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
