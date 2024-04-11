import { Timestamp } from 'firebase/firestore';

export type Collection = UserCollection | PostCollection;
export type Data = UserData | PostData;
export type UpdatableData = UserDataUpdate | PostDataUpdate;

// user
export type UserCollection = 'user';
export const COLLECTION_USER: UserCollection = 'user';

export interface UserData {
    firstname: string;
    lastname: string;
    username: string;
    email: string; // key
    profileImg?: string;
    description?: string;
    followers?: string[];
    following?: string[];
    wishlist?: string[];
    bookmark?: string[];
    timestamp?: Timestamp;
}

export interface UserDataUpdate {
    firstname?: string;
    lastname?: string;
    username?: string;
    profileImg?: string;
    description?: string;
    followers?: string[];
    following?: string[];
    wishlist?: string[];
    bookmark?: string[];
}

// post
export type PostCollection = 'post';
export const COLLECTION_POST: PostCollection = 'post';

export interface PostData {
    email: string; // user key
    content: string;
    images?: string[];
    timestamp?: Timestamp;
}

export interface PostDataUpdate {
    content?: string;
    images?: string[];
}

// review
// TODO make review data model
