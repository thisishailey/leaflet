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
                    <Box display={'flex'} gap={'2rem'}>
                        <Typography fontWeight={500}>{'이메일'}</Typography>
                        <Typography>{data.email}</Typography>
                    </Box>
                    <Box display={'flex'} gap={'2rem'}>
                        <Typography fontWeight={500}>{'이름'}</Typography>
                        <Typography>{data.firstname}</Typography>
                    </Box>
                    <Box display={'flex'} gap={'2rem'}>
                        <Typography fontWeight={500}>
                            {'프로필 이름'}
                        </Typography>
                        <Typography>
                            {data.profilename
                                ? data.profilename
                                : data.firstname}
                        </Typography>
                    </Box>
                </>
            )}
        </Container>
    );
}
