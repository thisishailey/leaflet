'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config';
import { User, onAuthStateChanged } from 'firebase/auth';

type UserState = User | null;

const AuthContext = createContext<{ user: UserState; loading: boolean }>({
    user: null,
    loading: true,
});
export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<UserState>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
