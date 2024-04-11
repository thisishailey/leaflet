import { firestore } from '../config';
import { doc, setDoc } from 'firebase/firestore';
import type { Collection, Data } from './model';

export default async function addData(
    collection: Collection,
    id: string,
    data: Data
) {
    let result: string | null = null,
        error: Error | null = null;

    try {
        await setDoc(doc(firestore, collection, id), data);
    } catch (e) {
        error = e as Error;
    }

    if (!error) {
        result = 'successfully added';
    }

    return { result, error };
}
