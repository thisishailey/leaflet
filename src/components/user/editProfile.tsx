'use client';

import { useState } from 'react';
import updateData from '@/firebase/db/updateData';
import { type UserDataUpdate, COLLECTION_USER } from '@/firebase/db/model';
import uploadFile from '@/firebase/storage/uploadFile';
import { PROFILE_IMAGE } from '@/firebase/storage/directory';
import { checkUsernameAvailability } from '@/firebase/db/query';
import { type UsernameState } from '@/app/auth/signup/page';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '@/state/snackbarState';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface EditProfileProps {
    open: boolean;
    handleClose: () => void;
    userData: {
        email: string;
        username: string;
        firstname: string;
        lastname: string;
        profileSrc: string | undefined;
        bio: string | undefined;
    };
}

export default function EditProfile({
    open,
    handleClose,
    userData,
}: EditProfileProps) {
    const setSnackbar = useSetRecoilState(snackbarState);
    const [profilePreview, setProfilePreview] = useState<string>();
    const [username, setUsername] = useState<UsernameState>({
        helper: '',
        error: false,
    });

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const image = files[0];
            const imagePreviewUrl = URL.createObjectURL(image);
            setProfilePreview(imagePreviewUrl);
        }
    };

    const usernamePattern: string = '^[a-zA-Z0-9_]{4,16}$';
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
            helper = '아이디는 영문, 숫자, 밑줄(_)만 입력 가능합니다.';
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newData: UserDataUpdate = {};
        let needUpdate = false;

        const username = data.get('username');
        const firstname = data.get('firstname');
        const lastname = data.get('lastname');
        const bio = data.get('bio');

        const inputData: {
            name: 'username' | 'firstname' | 'lastname' | 'bio';
            value: FormDataEntryValue | null;
        }[] = [
            { name: 'username', value: username },
            { name: 'firstname', value: firstname },
            { name: 'lastname', value: lastname },
            { name: 'bio', value: bio },
        ];

        inputData.forEach((input) => {
            if (
                input.value !== userData[input.name] &&
                typeof input.value === 'string' &&
                input.value
            ) {
                newData[input.name] = input.value;
                needUpdate = true;
            }
        });

        if (Boolean(profilePreview)) {
            const image = data.get('image');
            const { error, imageUrl } = await uploadFile(
                PROFILE_IMAGE,
                image as File
            );

            if (error) {
                setSnackbar('프로필 사진을 업로드하지 못했습니다.');
            } else {
                newData.profileImg = imageUrl;
                needUpdate = true;
            }
        }

        if (needUpdate) {
            const result = await updateData(
                COLLECTION_USER,
                userData.email,
                newData
            );

            if (result.error) {
                setSnackbar(
                    '프로필을 업데이트하지 못했습니다. 다시 시도해 주세요.'
                );
            } else {
                setSnackbar('프로필이 성공적으로 업데이트 되었습니다.');
            }
        }

        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    minWidth: 320,
                    p: 3,
                }}
            >
                <Stack
                    component={'form'}
                    onSubmit={handleSubmit}
                    direction={'column'}
                    spacing={2}
                >
                    <Typography
                        component={'h3'}
                        fontWeight={500}
                        fontSize={24}
                        textAlign={'center'}
                        pb={1}
                    >
                        {'프로필 수정'}
                    </Typography>
                    <Typography fontWeight={500} fontSize={16}>
                        {'프로필 사진'}
                    </Typography>
                    <Stack direction={'row'} justifyContent={'space-around'}>
                        <Avatar
                            src={
                                profilePreview
                                    ? profilePreview
                                    : userData.profileSrc
                            }
                            alt={userData.username}
                        >
                            {userData.username}
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
                    </Stack>
                    <Typography fontWeight={500} fontSize={16}>
                        {'아이디(닉네임)'}
                    </Typography>
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
                        defaultValue={userData.username}
                    />
                    <Typography fontWeight={500} fontSize={16}>
                        {'이름'}
                    </Typography>
                    <Stack direction={'row'} spacing={1}>
                        <TextField
                            required
                            fullWidth
                            name="lastname"
                            type="string"
                            label="성"
                            autoComplete="family-name"
                            defaultValue={userData.lastname}
                        />
                        <TextField
                            required
                            fullWidth
                            name="firstname"
                            type="string"
                            label="이름"
                            autoComplete="given-name"
                            defaultValue={userData.firstname}
                        />
                    </Stack>
                    <Typography fontWeight={500} fontSize={16}>
                        {'바이오'}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        name="bio"
                        type="string"
                        label="바이오"
                        defaultValue={userData.bio}
                        inputProps={{ maxLength: 200 }}
                    />
                    <Stack
                        direction={'row'}
                        justifyContent={'center'}
                        spacing={2}
                    >
                        <Button type="submit" variant="contained">
                            {'수정하기'}
                        </Button>
                        <Button onClick={handleClose} variant="outlined">
                            {'취소'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Modal>
    );
}
