import { firebaseApp } from '../config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default async function authSignUp(email: string, password: string) {
    const auth = getAuth(firebaseApp);
    let result = null,
        error = null;

    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
