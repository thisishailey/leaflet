import { auth } from '../config';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    getAdditionalUserInfo,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export const googleSignIn = async () => {
    let data: UserCredential | null = null,
        isNew: boolean = false,
        error: Error | null = null;

    const provider = new GoogleAuthProvider();

    try {
        data = await signInWithPopup(auth, provider);
        const additionalInfo = getAdditionalUserInfo(data);
        isNew = additionalInfo?.isNewUser || false;
    } catch (e) {
        error = e as Error;
    }

    return { data, isNew, error };
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
