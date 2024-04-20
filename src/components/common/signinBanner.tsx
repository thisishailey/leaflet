import Link from 'next/link';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function SignInBanner({ nextAction }: { nextAction: string }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                width: '100%',
                maxWidth: 976,
                p: 2,
                bgcolor: 'primary.light',
            }}
        >
            <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={2}
            >
                <Link
                    href={{
                        pathname: '/auth/signin',
                        query: { back: true },
                    }}
                >
                    <Button size="large" color="secondary" variant="outlined">
                        {'로그인 / 회원가입'}
                    </Button>
                </Link>
                <Typography
                    color={'secondary.main'}
                    display={{ xs: 'none', sm: 'block' }}
                >
                    {nextAction}
                </Typography>
            </Stack>
        </Paper>
    );
}
