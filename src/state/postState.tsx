import { type Post } from '@/firebase/db/query';
import { type RecoilState, atom } from 'recoil';

export const postState: RecoilState<Post[] | null> = atom({
    key: 'PostState',
    default: [] as Post[] | null,
});
