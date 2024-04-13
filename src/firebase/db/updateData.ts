import { firestore } from '../config';
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
} from 'firebase/firestore';
import {
    COLLECTION_POST,
    COLLECTION_USER,
    type Collection,
    type UpdatableData,
} from './model';

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

export async function updateLike(
    email: string,
    postId: string,
    decrement: boolean
) {
    let result: string | null = null,
        error: Error | null = null;

    if (decrement) {
        try {
            await updateDoc(doc(firestore, COLLECTION_USER, email), {
                like: arrayRemove(postId),
            });
            await updateDoc(doc(firestore, COLLECTION_POST, postId), {
                likes: increment(-1),
            });
        } catch (e) {
            error = e as Error;
        }
    } else {
        try {
            await updateDoc(doc(firestore, COLLECTION_USER, email), {
                like: arrayUnion(postId),
            });
            await updateDoc(doc(firestore, COLLECTION_POST, postId), {
                likes: increment(1),
            });
        } catch (e) {
            error = e as Error;
        }
    }

    if (!error) {
        result = 'successfully updated';
    }

    return { result, error };
}

export async function updateBookmark(
    email: string,
    postId: string,
    decrement: boolean
) {
    let result: string | null = null,
        error: Error | null = null;

    if (decrement) {
        try {
            await updateDoc(doc(firestore, COLLECTION_USER, email), {
                bookmark: arrayRemove(postId),
            });
        } catch (e) {
            error = e as Error;
        }
    } else {
        try {
            await updateDoc(doc(firestore, COLLECTION_USER, email), {
                bookmark: arrayUnion(postId),
            });
        } catch (e) {
            error = e as Error;
        }
    }

    if (!error) {
        result = 'successfully updated';
    }

    return { result, error };
}

export async function updateComment(postId: string, commentId: string) {
    let result: string | null = null,
        error: Error | null = null;

    try {
        await updateDoc(doc(firestore, COLLECTION_POST, postId), {
            comments: arrayUnion(commentId),
        });
    } catch (e) {
        error = e as Error;
    }

    if (!error) {
        result = 'successfully updated';
    }

    return { result, error };
}
