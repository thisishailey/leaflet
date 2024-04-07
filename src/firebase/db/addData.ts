import { firestoreDb } from '../config';
import { doc, setDoc } from 'firebase/firestore';
import type { Collection, Data } from './model';

export default async function addData(
    collection: Collection,
    id: string,
    data: Data
) {
    let result = null,
        error = null;

    try {
        await setDoc(doc(firestoreDb, collection, id), data);
    } catch (e) {
        error = e;
    }

    if (!error) {
        result = 'successfully added';
    }

    return { result, error };
}
