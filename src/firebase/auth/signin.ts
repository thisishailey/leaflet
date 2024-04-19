import { auth } from '../config';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export const googleSignIn = async () => {
    let data: UserCredential | null = null,
        error: Error | null = null;

    const provider = new GoogleAuthProvider();

    try {
        data = await signInWithPopup(auth, provider);
    } catch (e) {
        error = e as Error;
    }

    return { data, error };
};

export const passwordSignIn = async (email: string, password: string) => {
    let data: UserCredential | null = null,
        error: Error | null = null;

    try {
        data = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e as Error;
    }

    return { data, error };
};
