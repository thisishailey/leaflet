import { firebaseApp } from '../config';
import { getAuth, signOut } from 'firebase/auth';

export default async function authSignOut() {
    const auth = getAuth(firebaseApp);
    let result = null,
        error = null;

    try {
        result = await signOut(auth);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
