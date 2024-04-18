import { firestore } from '../config';
import { collection as col, query, where, getDocs } from 'firebase/firestore';
import { COLLECTION_USER } from './model';

export const checkUsernameAvailability = async (username: string) => {
    const q = query(
        col(firestore, COLLECTION_USER),
        where('username', '==', username)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return true;
    } else {
        return false;
    }
};
