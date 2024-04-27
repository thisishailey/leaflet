'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '../state';
import authSignOut from '../signout';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '@/state/snackbarState';
import Button from '@mui/material/Button';

export default function AuthButtons() {
    const { user } = useAuthContext();
    const { push } = useRouter();
    const setSnackbar = useSetRecoilState(snackbarState);

    const handleSignIn = () => push('/auth/signin');
    const handleSignOut = async () => {
        await authSignOut();
        setSnackbar('로그아웃 되었습니다.');
        push('/auth/signin');
    };

    return (
        <Button
            sx={{ minWidth: 'max-content' }}
            onClick={user === null ? handleSignIn : handleSignOut}
        >
            {user === null ? '로그인' : '로그아웃'}
        </Button>
    );
}
