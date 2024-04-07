import { firebaseApp } from '../config';
import { getAuth, signOut } from 'firebase/auth';

export default async function authSignOut() {
    const auth = getAuth(firebaseApp);
    let result: string | null = null,
        error = null;

    try {
        await signOut(auth);
    } catch (e) {
        error = e;
    }

    if (!error) {
        result = 'successfully signed out';
    }

    return { result, error };
}
