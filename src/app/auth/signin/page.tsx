'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import { passwordSignIn, googleSignIn } from '@/firebase/auth/signin';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { CopyrightShort } from '@/components/common/copyright';
import CustomAlert from '@/components/common/alert';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleLogoIcon from '@/assets/social/google';
import { roboto } from '@/styles/font';

export default function SignIn() {
    const { replace } = useRouter();
    const [alert, setAlert] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        const result = await passwordSignIn(email, password);

        if (result.error) {
            return setAlert(result.error.message);
        }

        return replace('/user/following');
    };

    const handleGoogleSignIn = async () => {
        const result = await googleSignIn();

        if (result.error) {
            return setAlert(result.error.message);
        }

        const user: User = result.data!.user!;

        const email = user.email as string;
        const provider = 'google';
    };

    return (
        <>
            <style>
                {`main {min-height: 0 !important;} footer {display: none;} #bottom-action-buttons {display: none;}`}
            </style>
            <CustomAlert alert={alert} setAlert={setAlert} />
            <Stack
                direction={'column'}
                alignItems={'center'}
                spacing={{ xs: 2, md: 4 }}
                mt={{ xs: 2, md: 4 }}
                p={2}
            >
                <Typography component="h2" fontSize={28} fontWeight={500}>
                    {'로그인'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} maxWidth={397}>
                    <TextField
                        required
                        fullWidth
                        margin="dense"
                        name="email"
                        type="email"
                        label="이메일"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        required
                        fullWidth
                        margin="dense"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="비밀번호"
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleTogglePasswordVisibility}
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
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="autoLogin"
                                    value="autoLogin"
                                    color="primary"
                                    size="small"
                                />
                            }
                            label="자동 로그인"
                            slotProps={{ typography: { fontSize: 14 } }}
                        />
                        <Link href="#">
                            <Typography fontSize={14}>
                                {'비밀번호 찾기'}
                            </Typography>
                        </Link>
                    </Stack>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 4,
                            p: 1.5,
                            fontSize: 16,
                            fontWeight: 500,
                        }}
                    >
                        {'로그인'}
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => replace('/auth/signup')}
                        variant="outlined"
                        sx={{
                            mt: 2,
                            p: 1.5,
                            fontSize: 16,
                            fontWeight: 500,
                        }}
                    >
                        {'회원가입'}
                    </Button>
                </Box>
                <Divider
                    flexItem
                    orientation="horizontal"
                    sx={{ fontSize: 14 }}
                >
                    {'또는'}
                </Divider>
                <Button
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        py: 1.5,
                        px: 2,
                        bgcolor: '#ffffff',
                        color: '#1f1f1f',
                        border: '1px solid #747775;',
                        borderRadius: '4px',
                        textTransform: 'none',
                    }}
                    variant="outlined"
                    onClick={handleGoogleSignIn}
                >
                    <GoogleLogoIcon />
                    <Typography
                        color={'#1f1f1f'}
                        fontWeight={500}
                        fontFamily={roboto.style.fontFamily}
                    >
                        {'Google 계정으로 로그인'}
                    </Typography>
                </Button>
            </Stack>
            <CopyrightShort sx={{ mt: { xs: 4, md: 6 }, mb: 4 }} />
        </>
    );
}
