import { auth } from '../config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export default async function authSignIn(email: string, password: string) {
    let result: UserCredential | null = null,
        error: Error | null = null;

    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e as Error;
    }

    return { result, error };
}
