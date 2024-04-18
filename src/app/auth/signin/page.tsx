'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authSignIn from '@/firebase/auth/signin';

import { CopyrightShort } from '@/components/common/copyright';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CustomAlert from '@/components/common/alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignIn() {
    const { replace } = useRouter();
    const [alert, setAlert] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignIn = async (email: string, password: string) => {
        const { error } = await authSignIn(email, password);

        if (error) {
            return setAlert(error.message);
        }

        return replace('/user/following');
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        handleSignIn(email, password);
    };

    return (
        <>
            <style>
                {`main {min-height: 0 !important;} footer {display: none;} #bottom-action-buttons {display: none;}`}
            </style>
            <Box
                sx={{
                    mt: { xs: 2, md: 8 },
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <CustomAlert alert={alert} setAlert={setAlert} />
                <Typography component="h3" fontSize={28} fontWeight={500}>
                    {'로그인'}
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: { xs: 2, md: 4 }, maxWidth: 397 }}
                >
                    <TextField
                        required
                        fullWidth
                        margin="dense"
                        id="email"
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
                        id="password"
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
                    <Box
                        display={'flex'}
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
                    </Box>
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
            </Box>
            <CopyrightShort sx={{ mt: { xs: 4, md: 6 }, mb: 4 }} />
        </>
    );
}
