import { firestore } from '../config';
import {
    doc,
    serverTimestamp,
    collection as col,
    setDoc,
    addDoc,
    DocumentReference,
} from 'firebase/firestore';
import {
    COLLECTION_COMMENT,
    CommentData,
    type Collection,
    type Data,
} from './model';

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

export async function addComment(data: CommentData) {
    let docRef: DocumentReference | null = null,
        commentId: string | null = null,
        error: Error | null = null;

    try {
        docRef = await addDoc(col(firestore, COLLECTION_COMMENT), {
            ...data,
            timestamp: serverTimestamp(),
        });
    } catch (e) {
        error = e as Error;
    }

    if (docRef) {
        commentId = docRef.id;
    }

    return { commentId, error };
}
