'use client';

import { useEffect, useState } from 'react';
import getData from '@/firebase/db/getData';
import type { UserData } from '@/firebase/db/model';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function UserProfile({ id }: { id: string }) {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<UserData>();

    const getUserData = async () => {
        const { result, error } = await getData('user', id);

        if (error) {
            console.log(error);
            return;
        }

        console.log(result);
        setData(result as UserData);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted) {
        getUserData();
        setMounted(false);
    }

    return (
        <Container>
            {data && (
                <>
                    <Box>
                        <Typography>{'이메일'}</Typography>
                        <Typography>{data.email}</Typography>
                    </Box>
                    <Box>
                        <Typography>{'이름'}</Typography>
                        <Typography>{data.firstName}</Typography>
                    </Box>
                    <Box>
                        <Typography>{'프로필 이름'}</Typography>
                        <Typography>
                            {data.profileName
                                ? data.profileName
                                : data.firstName}
                        </Typography>
                    </Box>
                </>
            )}
        </Container>
    );
}
