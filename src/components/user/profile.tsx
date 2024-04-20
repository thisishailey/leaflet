'use client';

import { useEffect, useState } from 'react';
import { getData, getProfileSrc } from '@/firebase/db/getData';
import { COLLECTION_USER, type UserData } from '@/firebase/db/model';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Avatar, Button, Stack } from '@mui/material';

export default function UserProfile({ email }: { email: string }) {
    const [user, setUser] = useState<UserData>();
    const [profileSrc, setProfileSrc] = useState<string>();

    useEffect(() => {
        const loadUser = async () => {
            const { result, error } = await getData(COLLECTION_USER, email);

            if (error) {
                return;
            }

            const user = result as UserData;
            setUser(user);

            if (user.profileImg) {
                const src = await getProfileSrc(user.profileImg);
                if (src) {
                    setProfileSrc(src);
                }
            }
        };

        loadUser();
    }, [email]);

    return (
        <>
            {user && (
                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    spacing={4}
                    my={4}
                >
                    <Stack
                        direction={'column'}
                        alignItems={'center'}
                        spacing={2}
                    >
                        <Avatar src={profileSrc} />
                        <Stack direction={'row'}>
                            <Button>{'수정'}</Button>
                            <Button>{'설정'}</Button>
                        </Stack>
                    </Stack>
                    <Stack direction={'column'} width={'100%'} spacing={2}>
                        <Typography>{user.username}</Typography>
                        <Stack direction={'row'} spacing={4}>
                            <Typography>
                                {`팔로워 ${user.follower?.length || 0}명`}
                            </Typography>
                            <Typography>
                                {`팔로잉 ${user.following?.length || 0}명`}
                            </Typography>
                        </Stack>
                        <Typography>
                            {user.bio || '바이오를 작성해 주세요.'}
                        </Typography>
                    </Stack>
                </Stack>
            )}
        </>
    );
}
