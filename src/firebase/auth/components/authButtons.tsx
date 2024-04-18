'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '../state';
import authSignOut from '../signout';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

export default function AuthButtons() {
    const { user } = useAuthContext();
    const { push } = useRouter();

    const handleSignOut = async () => {
        const { result, error } = await authSignOut();

        if (error) {
            console.log(error);
        }

        console.log(result);
    };

    return (
        <Container sx={{ textAlign: 'center' }}>
            {user === null ? (
                <Button size="large" onClick={() => push('/auth/signin')}>
                    {'로그인'}
                </Button>
            ) : (
                <Button size="large" onClick={handleSignOut}>
                    {'로그아웃'}
                </Button>
            )}
        </Container>
    );
}
