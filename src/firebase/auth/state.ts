import { firebaseApp } from '../config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const getAuthState = async () => {
    const auth = getAuth(firebaseApp);
    let currentUser = null,
        error = null;

    onAuthStateChanged(
        auth,
        (user) => {
            currentUser = user;
        },
        (err) => {
            error = err;
        }
    );

    return { currentUser, error };
};
