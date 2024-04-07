export type Collection = UserCollection;
export type Data = UserData;

// user
export type UserCollection = 'user';

export interface UserData {
    firstName: string;
    lastName: string;
    profileName?: string;
    email: string;
    profileImg?: string;
    description?: string;
    followers?: string[];
    following?: string[];
    wishlist?: string[];
    bookmark?: string[];
}

export interface AddUserDataProps {
    firstName: string;
    lastName: string;
    email: string;
}

export const COLLECTION_USER: UserCollection = 'user';

// post

// review
