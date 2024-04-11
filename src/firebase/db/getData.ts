import { firestore } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import type { Collection, Data } from './model';

export default async function getData(collection: Collection, id: string) {
    let result: Data | null = null,
        error: string | null = null;

    const docSnap = await getDoc(doc(firestore, collection, id));

    if (docSnap.exists()) {
        result = docSnap.data() as Data;
    } else {
        error = 'requested data does not exist';
    }

    return { result, error };
}
