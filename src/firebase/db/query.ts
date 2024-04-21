import { cache } from 'react';
import {
    type Timestamp,
    collection as col,
    query,
    where,
    getDocs,
    orderBy,
} from 'firebase/firestore';
import { firestore } from '../config';
import {
    type ReviewData,
    type PostData,
    COLLECTION_REVIEW,
    COLLECTION_USER,
    COLLECTION_POST,
} from './model';
import { type UserBasic, getUserProfile } from './getData';

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

export interface Post {
    id: string;
    data: PostData;
    writer: UserBasic;
    match?: number;
}

export const getPosts = cache(async () => {
    const result: Post[] = [];
    let isEmpty: boolean = false;

    const q = query(
        col(firestore, COLLECTION_POST),
        orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        isEmpty = true;
        return { result, isEmpty };
    }

    for (const doc of querySnapshot.docs) {
        const postData = doc.data() as PostData;
        const user = await getUserProfile(postData.email);

        if (user.error) {
            continue;
        }

        const post = {
            id: doc.id,
            data: postData,
            writer: user.data as UserBasic,
        };

        result.push(post);
    }

    return { result, isEmpty };
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
        where('isbn', '==', isbn),
        orderBy('timestamp', 'desc')
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
