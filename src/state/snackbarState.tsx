import { type RecoilState, atom } from 'recoil';

export const snackbarState: RecoilState<string> = atom({
    key: 'SnackbarState',
    default: '',
});
