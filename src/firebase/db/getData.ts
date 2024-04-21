import { cache } from 'react';
import { firestore } from '../config';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import getFile from '../storage/getFile';
import { getElapsedTime, getFormattedDate } from '@/util/datetime';
import {
    type CommentData,
    type PostData,
    type UserData,
    type Collection,
    type Data,
    COLLECTION_COMMENT,
    COLLECTION_POST,
    COLLECTION_USER,
} from './model';

export const getData = cache(async (collection: Collection, id: string) => {
    let result: Data | null = null,
        error: string | null = null;

    const docSnap = await getDoc(doc(firestore, collection, id));

    if (docSnap.exists()) {
        result = docSnap.data() as Data;
    } else {
        error = 'requested data does not exist';
    }

    return { result, error };
});

export interface UserProfile extends UserData {}

export const getProfileSrc = cache(async (profileImg: string) => {
    const { result } = await getFile(profileImg);
    return result;
});

export const getUserProfileAll = cache(async (email: string) => {
    let data: UserBasic | null = null,
        error: string | null = null;

    const docSnap = await getDoc(doc(firestore, COLLECTION_USER, email));

    if (!docSnap.exists()) {
        error = 'requested data does not exist';
        return { data, error };
    }

    const userData = docSnap.data() as UserData;

    let src = '';
    if (userData.profileImg) {
        const { result } = await getFile(userData.profileImg);
        if (result) {
            src = result;
        }
    }

    data = {
        email: userData.email,
        username: userData.username,
        profileSrc: src,
    };

    return { data, error };
});

export interface UserBasic {
    email: string;
    username: string;
    profileSrc: string;
}

export const getUserProfile = cache(async (email: string) => {
    let data: UserBasic | null = null,
        error: string | null = null;

    const docSnap = await getDoc(doc(firestore, COLLECTION_USER, email));

    if (!docSnap.exists()) {
        error = 'requested data does not exist';
        return { data, error };
    }

    const userData = docSnap.data() as UserData;

    let src = '';
    if (userData.profileImg) {
        const { result } = await getFile(userData.profileImg);
        if (result) {
            src = result;
        }
    }

    data = {
        email: userData.email,
        username: userData.username,
        profileSrc: src,
    };

    return { data, error };
});

export interface CurrentUserPost {
    email: string;
    username: string;
    profileSrc: string;
    like: boolean;
    bookmark: boolean;
}

export const getCurrentUserOnPost = cache(
    async (email: string, postId: string) => {
        let data: CurrentUserPost | null = null,
            error: string | null = null;

        const docSnap = await getDoc(doc(firestore, COLLECTION_USER, email));

        if (!docSnap.exists()) {
            error = 'requested data does not exist';
            return { data, error };
        }

        const userData = docSnap.data() as UserData;

        let src = '';
        if (userData.profileImg) {
            const { result } = await getFile(userData.profileImg);
            if (result) {
                src = result;
            }
        }

        const isLiked = userData.like?.includes(postId) || false;
        const isBookmarked = userData.bookmark?.includes(postId) || false;

        data = {
            email: userData.email,
            username: userData.username,
            profileSrc: src,
            like: isLiked,
            bookmark: isBookmarked,
        };

        return { data, error };
    }
);

export type CommentDetail = CommentData & UserBasic & { elapsedTime: string };

export const getComments = cache(async (commentIds: string[]) => {
    const data: CommentDetail[] = [];

    for (const commentId of commentIds) {
        const docSnap = await getDoc(
            doc(firestore, COLLECTION_COMMENT, commentId)
        );

        if (!docSnap.exists()) {
            continue;
        }

        const commentData = docSnap.data() as CommentData;
        const timestamp = commentData.timestamp as Timestamp;
        const elapsedTime = getElapsedTime(timestamp.toDate());

        const user = await getUserProfile(commentData.email);

        if (user.error) {
            continue;
        }

        const userData = user.data as UserBasic;
        data.push({
            ...commentData,
            ...userData,
            elapsedTime,
        });
    }

    return data;
});

export interface PostDetail extends UserBasic {
    content: string;
    likes: number;
    elapsedTime: string;
    images: string[];
    comments: CommentDetail[];
}

export const getPost = cache(async (postId: string) => {
    let data: PostDetail | null = null,
        error: string | null = null;

    const docSnap = await getDoc(doc(firestore, COLLECTION_POST, postId));

    if (!docSnap.exists()) {
        error = 'requested data does not exist';
        return { data, error };
    }

    const postData = docSnap.data() as PostData;

    const user = await getUserProfile(postData.email);

    const timestamp = postData.timestamp as Timestamp;
    const elapsedTime = getElapsedTime(timestamp.toDate());

    const images: string[] = [];
    if (postData.images) {
        for (const image of postData.images) {
            const { result } = await getFile(image);
            if (result) {
                images.push(result);
            }
        }
    }

    let comments: CommentDetail[] = [];
    if (postData.comments) {
        comments = await getComments(postData.comments);
    }

    data = {
        email: user.data?.email || '',
        username: user.data?.username || '',
        profileSrc: user.data?.profileSrc || '',
        content: postData.content,
        likes: postData.likes || 0,
        elapsedTime,
        images,
        comments,
    };

    return { data, error };
});

export interface PostPreview extends PostData {
    username: string;
    date: string;
}

export const getPostPreview = cache(async (postId: string) => {
    let data: PostPreview | null = null,
        error: string | null = null;

    const docSnap = await getDoc(doc(firestore, COLLECTION_POST, postId));

    if (!docSnap.exists()) {
        error = 'requested data does not exist';
        return { data, error };
    }

    const postData = docSnap.data() as PostData;

    const user = await getUserProfile(postData.email);

    const timestamp = postData.timestamp as Timestamp;
    const date = getFormattedDate(timestamp.toDate());

    data = {
        email: user.data?.email || '',
        username: user.data?.username || '',
        content: postData.content,
        likes: postData.likes || 0,
        date,
    };

    return { data, error };
});
