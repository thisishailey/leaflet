import { firebaseAuth } from '../config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export interface AuthSignUpProps {
    email: string;
    password: string;
}

export default async function authSignUp({ email, password }: AuthSignUpProps) {
    let result: UserCredential | null = null,
        error = null;

    try {
        result = await createUserWithEmailAndPassword(
            firebaseAuth,
            email,
            password
        );
    } catch (e) {
        error = e;
    }

    return { result, error };
}
