'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useResetRecoilState } from 'recoil';
import { socialSignUpState, signUpStepState } from '@/state/signUpState';

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
    user: null,
    loading: true,
});
export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const resetSocialSignUp = useResetRecoilState(socialSignUpState);
    const resetSignUpStep = useResetRecoilState(signUpStepState);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (user === null) {
            resetSocialSignUp();
            resetSignUpStep();
        }
    }, [loading, user, resetSignUpStep, resetSocialSignUp]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
