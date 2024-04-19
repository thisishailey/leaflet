import { cache } from 'react';
import {
    type Timestamp,
    collection as col,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { firestore } from '../config';
import {
    type ReviewData,
    COLLECTION_REVIEW,
    COLLECTION_USER,
    COLLECTION_POST,
} from './model';
import { getUserProfile } from './getData';

export const checkUsernameAvailability = cache(async (username: string) => {
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
});

export const getPosts = cache(async () => {
    const querySnapshot = await getDocs(col(firestore, COLLECTION_POST));
    return querySnapshot;
});

export interface BookReview extends ReviewData {
    username?: string;
    profileSrc?: string;
    date: string;
}

export const getReviews = cache(async (isbn: string) => {
    const data: BookReview[] = [];

    const q = query(
        col(firestore, COLLECTION_REVIEW),
        where('isbn', '==', isbn)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return data;
    }

    for (const doc of querySnapshot.docs) {
        const reviewData = doc.data() as ReviewData;
        const user = await getUserProfile(reviewData.email);

        const timestamp = (reviewData.timestamp as Timestamp).toDate();
        const date = `${timestamp.getFullYear()}/${
            timestamp.getMonth() + 1
        }/${timestamp.getDate()}`;

        const review: BookReview = {
            ...reviewData,
            ...user.data,
            date,
        };

        data.push(review);
    }

    return data;
});
