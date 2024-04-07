export type Collection = UserCollection;
export type Data = UserData;

// user
export type UserCollection = 'user';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    memberSince: Date;
}

export const COLLECTION_USER: UserCollection = 'user';

// post

// review
