'use client';

import { useRouter } from 'next/navigation';
import authSignOut from '../signout';
import { useAuthContext } from '../state';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

export default function AuthButtons() {
    const { push } = useRouter();
    const { user } = useAuthContext();

    const handleSignOut = async () => {
        const { result, error } = await authSignOut();

        if (error) {
            console.log(error);
        }

        console.log(result);
    };

    return (
        <Container sx={{ textAlign: 'center' }}>
            {user ? (
                <Button size="large" onClick={handleSignOut}>
                    {'로그아웃'}
                </Button>
            ) : (
                <Button size="large" onClick={() => push('/auth/signin')}>
                    {'로그인'}
                </Button>
            )}
        </Container>
    );
}
