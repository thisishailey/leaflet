import { auth } from '../config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export interface AuthSignUpProps {
    email: string;
    password: string;
}

export default async function authSignUp({ email, password }: AuthSignUpProps) {
    let result: UserCredential | null = null,
        error: Error | null = null;

    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e as Error;
    }

    return { result, error };
}
