import { firestore } from '../config';
import {
    doc,
    serverTimestamp,
    collection as col,
    setDoc,
    addDoc,
} from 'firebase/firestore';
import type { Collection, Data } from './model';

export default async function addData(
    collection: Collection,
    data: Data,
    id?: string
) {
    let result: string | null = null,
        error: Error | null = null;

    try {
        if (id) {
            await setDoc(doc(firestore, collection, id), {
                ...data,
                timestamp: serverTimestamp(),
            });
        } else {
            await addDoc(col(firestore, collection), {
                ...data,
                timestamp: serverTimestamp(),
            });
        }
    } catch (e) {
        error = e as Error;
    }

    if (!error) {
        result = 'successfully added';
    }

    return { result, error };
}
