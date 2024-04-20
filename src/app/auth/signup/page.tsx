'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import authSignUp from '@/firebase/auth/signup';
import addData from '@/firebase/db/addData';
import updateData from '@/firebase/db/updateData';
import uploadFile from '@/firebase/storage/uploadFile';
import { PROFILE_IMAGE } from '@/firebase/storage/directory';
import { type UserDataUpdate, COLLECTION_USER } from '@/firebase/db/model';
import { checkUsernameAvailability } from '@/firebase/db/query';
import { useRecoilValue, useRecoilState } from 'recoil';
import { signUpStepState, socialSignUpState } from '@/state/signUpState';
import { emptyValue } from '@/util/common';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { CopyrightShort } from '@/components/common/copyright';
import CustomAlert from '@/components/common/alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordVisibility {
    password: boolean;
    rePassword: boolean;
}

interface RePasswordState {
    value: string;
    helper: string;
    error: boolean;
}

interface UsernameState {
    helper: string;
    error: boolean;
}

interface UserDataState {
    email: string;
    password: string;
    username: string;
    imagePreviewUrl: string;
}

const steps: string[] = ['계정 만들기', '이름 입력하기', '프로필 꾸미기'];
const passwordPattern: string = '(?=.*[0-9])(?=.*[a-z]).{8,}';
const usernamePattern: string = '^[a-zA-Z0-9_]{4,16}$';

export default function SignUp() {
    const { replace } = useRouter();
    const [activeStep, setActiveStep] = useRecoilState(signUpStepState);
    const socialSignUp = useRecoilValue(socialSignUpState);

    const [alert, setAlert] = useState<React.ReactNode>('');
    const [password, setPassword] = useState<string>('');
    const [passwordHelper, setPasswordHelper] = useState<string>('');

    const [showPassword, setShowPassword] = useState<PasswordVisibility>({
        password: false,
        rePassword: false,
    });
    const [rePassword, setRePassword] = useState<RePasswordState>({
        value: '',
        helper: '',
        error: false,
    });

    const [username, setUsername] = useState<UsernameState>({
        helper: '',
        error: false,
    });

    const userDataDefault = {
        email: socialSignUp.isSocialSignUp ? socialSignUp.email : '',
        password: '',
        username: '',
        imagePreviewUrl: '',
    };
    const [userData, setUserData] = useState<UserDataState>(userDataDefault);

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

    const handleNextStep = () => {
        setAlert('');
        setActiveStep(activeStep + 1);
    };

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setPassword(value);

        if (value === '') {
            return setRePassword((prev) => ({
                ...prev,
                helper: '비밀번호를 먼저 입력해 주세요.',
            }));
        } else if (!RegExp(passwordPattern).test(value)) {
            setPasswordHelper(
                '비밀번호는 8자 이상, 영문 소문자와 숫자가 각각 1자 이상 들어가야 합니다.'
            );
        } else {
            setPasswordHelper('');
        }

        handleCheckPassword(value, rePassword.value);
    };

    const handleRePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        setRePassword((prev) => ({
            ...prev,
            value,
        }));

        handleCheckPassword(password, value);
    };

    const handleCheckPassword = (v1: string, v2: string) => {
        let helper: string;
        let error: boolean = false;

        if (v2 === '') {
            return;
        }

        if (v1 === v2) {
            helper = '비밀번호와 일치합니다.';
        } else {
            helper = '비밀번호와 일치하지 않습니다.';
            error = true;
        }

        setRePassword((prev) => ({
            ...prev,
            helper,
            error,
        }));
    };

    const handleStepOne = async (data: FormData) => {
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const rePassword = data.get('re-password') as string;

        if (password !== rePassword) {
            emptyValue('#password');
            emptyValue('#re-password');
            return setAlert(
                '비밀번호가 일치하지 않습니다. 다시 시도해 주세요.'
            );
        }

        setUserData((prev) => ({ ...prev, email, password }));
        handleNextStep();
    };

    const handleCheckUsername = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        let helper: string = '';
        let error: boolean = false;

        if (value === '') {
            helper = '';
            error = false;
        } else if (value.length < 4 || value.length > 16) {
            helper = '아이디는 4자 이상 16자 이하입니다.';
            error = true;
        } else if (!RegExp(usernamePattern).test(value)) {
            helper =
                '아이디는 영문 대소문자와 숫자, 밑줄(_)만 입력 가능합니다.';
            error = true;
        } else {
            const isAvailable: boolean = await checkUsernameAvailability(value);
            if (isAvailable) {
                helper = '사용 가능한 아이디입니다.';
                error = false;
            } else {
                helper = '이미 존재하는 아이디입니다.';
                error = true;
            }
        }

        setUsername({ helper, error });
    };

    const restartSignUp = (
        <>
            {'오류가 발생했습니다. 처음부터 다시 시도해 주세요.'}
            <Typography
                component={'span'}
                fontSize={13}
                fontWeight={500}
                ml={5}
                onClick={() => {
                    if (socialSignUp.isSocialSignUp) {
                        replace('/auth/signin');
                    } else {
                        setActiveStep(0);
                        setUserData(userDataDefault);
                    }
                }}
            >
                {'처음으로'}
            </Typography>
        </>
    );

    const handleStepTwo = async (data: FormData) => {
        const username = data.get('username');
        const firstname = data.get('firstname');
        const lastname = data.get('lastname');
        let user: User;

        if (!socialSignUp.isSocialSignUp) {
            const authResult = await authSignUp({
                email: userData.email,
                password: userData.password,
            });

            if (!authResult.result) {
                return setAlert(restartSignUp);
            }

            user = authResult.result.user;
        } else {
            user = socialSignUp.user as User;
        }

        if (!username || !firstname || !lastname) {
            user.delete();
            return setAlert(restartSignUp);
        }

        const dbResult = await addData(
            COLLECTION_USER,
            {
                email: userData.email,
                username: username as string,
                firstname: firstname as string,
                lastname: lastname as string,
            },
            userData.email
        );

        if (dbResult.error) {
            user.delete();
            return setAlert(restartSignUp);
        }

        setUserData((prev) => ({ ...prev, username: username as string }));
        handleNextStep();
    };

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const image = files[0];
            const imagePreviewUrl = URL.createObjectURL(image);
            setUserData((prev) => ({ ...prev, imagePreviewUrl }));
        }
    };

    const handleStepThree = async (data: FormData) => {
        const image = data.get('image');
        const bio = data.get('bio');

        let newData: UserDataUpdate = {},
            needUpdate: boolean = false;
        if (image) {
            const { error, imageUrl } = await uploadFile(
                PROFILE_IMAGE,
                image as File
            );

            if (error) {
                setAlert('프로필 사진을 업로드하지 못했습니다.');
            } else {
                newData = { profileImg: imageUrl };
                needUpdate = true;
            }
        }
        if (bio) {
            newData = { ...newData, bio: bio as string };
            needUpdate = true;
        }

        if (needUpdate) {
            const { error } = await updateData('user', userData.email, newData);

            if (error) {
                setAlert('프로필 사진 / 바이오를 업로드하지 못했습니다.');
            }
        }

        replace('/user');
    };

    return (
        <>
            <style>
                {`main {min-height: 0 !important;} footer {display: none;} #bottom-action-buttons {display: none;}`}
            </style>
            <CustomAlert alert={alert} setAlert={setAlert} />
            <Alert
                severity="info"
                sx={{
                    display:
                        activeStep === 2
                            ? 'flex'
                            : socialSignUp.isSocialSignUp
                            ? 'flex'
                            : 'none',
                }}
            >
                {activeStep === 2
                    ? `필수 항목이 아닙니다. 작성을 원치 않으시면 바로 완료를 눌러주세요.`
                    : `${socialSignUp.provider} 계정으로 회원가입을 완료하시려면, 아래 항목을 입력해 주세요.`}
            </Alert>
            <Stack
                direction={'column'}
                alignItems={'center'}
                mt={{ xs: 2, md: 4 }}
                p={2}
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
                    mt={{ xs: 6, md: 8 }}
                >
                    {activeStep === 0 && (
                        <>
                            <TextField
                                required
                                fullWidth
                                margin="dense"
                                name="email"
                                type="email"
                                label="이메일"
                                autoComplete="email"
                            />
                            <TextField
                                required
                                fullWidth
                                margin="dense"
                                name="password"
                                label="비밀번호"
                                autoComplete="new-password"
                                type={
                                    showPassword.password ? 'text' : 'password'
                                }
                                inputProps={{ pattern: passwordPattern }}
                                onChange={handlePasswordChange}
                                helperText={passwordHelper}
                                error={passwordHelper !== ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    setShowPassword((prev) => ({
                                                        ...prev,
                                                        password:
                                                            !prev.password,
                                                    }))
                                                }
                                            >
                                                {showPassword.password ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                margin="dense"
                                name="re-password"
                                label="비밀번호 재입력"
                                autoComplete="new-password"
                                type={
                                    showPassword.rePassword
                                        ? 'text'
                                        : 'password'
                                }
                                onChange={handleRePasswordChange}
                                disabled={password === ''}
                                error={rePassword.error}
                                helperText={rePassword.helper}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    setShowPassword((prev) => ({
                                                        ...prev,
                                                        rePassword:
                                                            !prev.rePassword,
                                                    }))
                                                }
                                            >
                                                {showPassword.rePassword ? (
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
                                        name="receiveEmail"
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
                                    name="lastname"
                                    type="string"
                                    label="성"
                                    autoComplete="family-name"
                                    autoFocus
                                />
                                <TextField
                                    required
                                    fullWidth
                                    name="firstname"
                                    type="string"
                                    label="이름"
                                    autoComplete="given-name"
                                />
                            </Stack>
                            <TextField
                                required
                                fullWidth
                                name="username"
                                type="string"
                                label="아이디"
                                autoComplete="username"
                                inputProps={{ pattern: usernamePattern }}
                                onChange={handleCheckUsername}
                                helperText={username.helper}
                                error={username.error}
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
                                    src={userData.imagePreviewUrl}
                                    alt={userData.username}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                    }}
                                    slotProps={{
                                        img: { width: 60, height: 60 },
                                    }}
                                />
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
                                name="bio"
                                type="string"
                                label="바이오"
                                placeholder="나를 소개해 보세요!"
                                inputProps={{ maxlength: 200 }}
                            />
                        </>
                    )}
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 6,
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
            </Stack>
            <CopyrightShort sx={{ mt: { xs: 4, md: 6 }, mb: 4 }} />
        </>
    );
}
