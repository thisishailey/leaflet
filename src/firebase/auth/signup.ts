import { firebaseApp } from '../config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export default async function authSignUp(email: string, password: string) {
    const auth = getAuth(firebaseApp);
    let result: UserCredential | null = null,
        error = null;

    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
