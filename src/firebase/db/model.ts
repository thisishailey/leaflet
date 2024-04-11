export type Collection = UserCollection | PostCollection;
export type Data = UserData | PostData;

// user
export type UserCollection = 'user';

export interface UserData {
    firstName: string;
    lastName: string;
    userName: string; // key
    email: string; // auth key
    profileImg?: string;
    description?: string;
    followers?: string[];
    following?: string[];
    wishlist?: string[];
    bookmark?: string[];
}

export const COLLECTION_USER: UserCollection = 'user';

// post
export type PostCollection = 'post';

export interface PostData {
    userName: string; // user key
    profileImg?: string;
    content: string;
    date: Date;
}

export const COLLECTION_POST: PostCollection = 'post';

// review
// TODO make review data model
