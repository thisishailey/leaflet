'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '../state';
import authSignOut from '../signout';
import Button from '@mui/material/Button';

export default function AuthButtons() {
    const { user } = useAuthContext();
    const { push } = useRouter();

    const handleSignIn = () => push('/auth/signin');
    const handleSignOut = async () => {
        await authSignOut();
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
