import { firestoreDb } from '../config';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import type { Collection } from './model';

export default async function getData(collection: Collection, id: string) {
    let result: DocumentData | null = null,
        error: string | null = null;

    const docSnap = await getDoc(doc(firestoreDb, collection, id));

    if (docSnap.exists()) {
        result = docSnap.data();
    } else {
        error = 'requested data does not exist';
    }

    return { result, error };
}
