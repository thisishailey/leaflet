'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CopyrightShort } from '@/components/common/copyright';

export default function SignUp() {
    const { replace } = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <>
            <style>{'body {height: 100vh; overflow: hidden;}'}</style>
            <Box
                sx={{
                    marginTop: 8,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h3" fontSize={'28px'} fontWeight={500}>
                    {'회원가입'}
                </Typography>
                <Box
                    noValidate
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 4 }}
                >
                    <Grid container spacing={2} sx={{ width: '397px' }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="firstName"
                                name="firstName"
                                label="성"
                                autoComplete="given-name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                name="lastName"
                                label="이름"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                label="이메일"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="비밀번호"
                                autoComplete="new-password"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="receiveEmail"
                                        value="receiveEmail"
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label="이메일 수신 동의"
                                slotProps={{ typography: { fontSize: '14px' } }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 5,
                            padding: '10px',
                            fontSize: '16px',
                            fontWeight: 500,
                        }}
                    >
                        {'회원가입'}
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => replace('/auth/signin')}
                        variant="outlined"
                        sx={{
                            mt: 2,
                            padding: '10px',
                            fontSize: '16px',
                            fontWeight: 500,
                        }}
                    >
                        {'로그인'}
                    </Button>
                </Box>
            </Box>
            <CopyrightShort sx={{ mt: 8, mb: 4 }} />
        </>
    );
}
