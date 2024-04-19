'use client';

import { useEffect, useState } from 'react';
import {getData} from '@/firebase/db/getData';
import { COLLECTION_USER, type UserData } from '@/firebase/db/model';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function UserProfile({ email }: { email: string }) {
    const [user, setUser] = useState<UserData>();

    useEffect(() => {
        const loadUser = async () => {
            const { result, error } = await getData(COLLECTION_USER, email);

            if (error) {
                return;
            }

            setUser(result as UserData);
        };

        loadUser();
    }, [email]);

    return (
        <>
            {user && (
                <Box>
                    <Typography>{user.email}</Typography>
                </Box>
            )}
        </>
    );
}
