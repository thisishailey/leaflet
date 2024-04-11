'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authSignUp from '@/firebase/auth/signup';
import addData from '@/firebase/db/addData';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { CopyrightShort } from '@/components/common/copyright';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const steps = ['계정 만들기', '이름 입력하기', '프로필 꾸미기'];

export default function SignUp() {
    const { replace } = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [userImage, setUserImage] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const image = files[0];
            const url = URL.createObjectURL(image);
            setUserImage(url);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        switch (activeStep) {
            case 0:
                handleStepOne(data);
                break;
            case 1:
                handleStepTwo(data);
                break;
            case 2:
                handleStepThree(data);
                break;
        }
    };

    const handleStepOne = async (data: FormData) => {
        const email = data.get('email') as string;
        setEmail(email);
        const password = data.get('password') as string;

        const { result, error } = await authSignUp({ email, password });

        if (error) {
            return console.log(error);
        }

        console.log(result);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleStepTwo = async (data: FormData) => {
        const userName = data.get('userName') as string;
        setUserName(userName);
        const firstName = data.get('firstName') as string;
        const lastName = data.get('lastName') as string;

        const { result, error } = await addData('user', email, {
            email,
            userName,
            firstName,
            lastName,
        });

        if (error) {
            return console.log(error);
        }

        console.log(result);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleStepThree = async (data: FormData) => {
        const image = data.get('image') as string;
        const description = data.get('description') as string;

        console.log(image, description);

        replace('/user');
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
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{ width: '100%', maxWidth: 600 }}
                >
                    {steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    width={'100%'}
                    maxWidth={'397px'}
                    mt={{ xs: 4, md: 6 }}
                >
                    {activeStep === 0 && (
                        <>
                            <TextField
                                required
                                fullWidth
                                margin="dense"
                                id="email"
                                name="email"
                                type="email"
                                label="이메일"
                                autoComplete="email"
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
                        </>
                    )}
                    {activeStep === 1 && (
                        <>
                            <Stack direction={'row'} spacing={2} mb={2}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    type="string"
                                    label="성"
                                    autoComplete="family-name"
                                    autoFocus
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    type="string"
                                    label="이름"
                                    autoComplete="given-name"
                                />
                            </Stack>
                            <TextField
                                required
                                fullWidth
                                id="userName"
                                name="userName"
                                type="string"
                                label="아이디"
                                autoComplete="username"
                            />
                        </>
                    )}
                    {activeStep === 2 && (
                        <>
                            <Paper
                                variant="outlined"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    py: 2,
                                    bgcolor: 'transparent',
                                }}
                            >
                                <Avatar
                                    src={userImage}
                                    alt={userName}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                    }}
                                    slotProps={{
                                        img: { width: 60, height: 60 },
                                    }}
                                >
                                    {userName}
                                </Avatar>
                                <Button size="large">
                                    <Box
                                        component={'label'}
                                        htmlFor="image"
                                        fontWeight={400}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {'프로필 사진 업로드'}
                                        <input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImage}
                                        />
                                    </Box>
                                </Button>
                            </Paper>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                                id="description"
                                name="description"
                                type="string"
                                label="바이오"
                                placeholder="나를 소개해 보세요!"
                            />
                        </>
                    )}
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
                        {activeStep === 0
                            ? '회원가입'
                            : activeStep === 1
                            ? '다음'
                            : '완료'}
                    </Button>
                    {activeStep === 0 && (
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
                    )}
                </Box>
            </Box>
            <CopyrightShort sx={{ mt: { xs: 4, md: 6 }, mb: 4 }} />
        </>
    );
}
