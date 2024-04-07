'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authSignUp from '@/firebase/auth/signup';
import type { AuthSignUpProps } from '@/firebase/auth/signup';
import addData from '@/firebase/db/addData';
import type { AddUserDataProps } from '@/firebase/db/model';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { CopyrightShort } from '@/components/common/copyright';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignUp() {
    const { replace } = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const firstName = data.get('firstName') as string;
        const lastName = data.get('lastName') as string;

        const success = await handleAuth({ email, password, firstName });
        if (!success) {
            console.log('sign up failed');
            return;
        }

        const complete = await handleDb({ email, firstName, lastName });
        if (complete) {
            replace('/profile');
        }
    };

    const handleAuth = async (props: AuthSignUpProps) => {
        const { result, error } = await authSignUp(props);

        if (error) {
            console.log(error);
            return false;
        }

        console.log(result);
        return true;
    };

    const handleDb = async (props: AddUserDataProps) => {
        const { result, error } = await addData('user', props.email, props);

        if (error) {
            console.log(error);
            return false;
        }

        console.log(result);
        return true;
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <style>
                {`main {min-height: 0 !important;} footer {display: none;} #bottom-action-buttons {display: none;}`}
            </style>
            <Box
                sx={{
                    mt: { xs: 0, sm: 2, md: 8 },
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
                    sx={{ mt: { xs: 2, md: 4 }, maxWidth: '397px' }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                name="lastName"
                                label="성"
                                autoComplete="family-name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="firstName"
                                name="firstName"
                                label="이름"
                                autoComplete="given-name"
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
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleTogglePasswordVisibility
                                                }
                                            >
                                                {showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
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
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 4,
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
            <CopyrightShort sx={{ mt: { xs: 4, md: 6 }, mb: 4 }} />
        </>
    );
}
