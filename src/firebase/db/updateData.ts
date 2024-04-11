import { firestore } from '../config';
import { doc, updateDoc } from 'firebase/firestore';
import type { Collection, UpdatableData } from './model';

export default async function updateData(
    collection: Collection,
    id: string,
    data: UpdatableData
) {
    let result: string | null = null,
        error: Error | null = null;

    try {
        await updateDoc(doc(firestore, collection, id), { ...data });
    } catch (e) {
        error = e as Error;
    }

    if (!error) {
        result = 'successfully updated';
    }

    return { result, error };
}
