import { firebaseAuth } from '../config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export interface AuthSignUpProps {
    email: string;
    password: string;
    firstName: string;
}

export default async function authSignUp({
    email,
    password,
    firstName,
}: AuthSignUpProps) {
    let result: UserCredential | null = null,
        error = null;

    try {
        result = await createUserWithEmailAndPassword(
            firebaseAuth,
            email,
            password
        );
        const currentUser = result.user;
        await updateProfile(currentUser, { displayName: firstName });
    } catch (e) {
        error = e;
    }

    return { result, error };
}
