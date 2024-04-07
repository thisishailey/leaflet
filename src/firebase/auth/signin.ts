import { firebaseApp } from '../config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export default async function authSignIn(email: string, password: string) {
    const auth = getAuth(firebaseApp);
    let result: UserCredential | null = null,
        error = null;

    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
