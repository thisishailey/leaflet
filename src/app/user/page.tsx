'use client';

import { useState } from 'react';
import { useAuthContext } from '@/firebase/auth/state';
import AuthButtons from '@/firebase/auth/components/authButtons';
import UserProfile from '@/components/user/profile';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Profile() {
    const { user } = useAuthContext();

    const [value, setValue] = useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <AuthButtons />
            {user && <UserProfile email={user.email as string} />}
            <Box width={'100%'}>
                <TabContext value={value}>
                    <Box borderBottom={1} borderColor={'divider'}>
                        <TabList onChange={handleChange}>
                            <Tab
                                label="내 리프"
                                value="1"
                                sx={{ flexGrow: 1, color: 'GrayText' }}
                            />
                            <Tab
                                label="내 리뷰"
                                value="2"
                                sx={{ flexGrow: 1, color: 'GrayText' }}
                            />
                            <Tab
                                icon={<FavoriteIcon />}
                                value="3"
                                sx={{ flexGrow: 1, color: 'GrayText' }}
                            />
                            <Tab
                                icon={<BookmarkIcon />}
                                value="4"
                                sx={{ flexGrow: 1, color: 'GrayText' }}
                            />
                        </TabList>
                    </Box>
                    <TabPanel value="1">{'내 리프'}</TabPanel>
                    <TabPanel value="2">{'내 리뷰'}</TabPanel>
                    <TabPanel value="3">{'내가 좋아요 누른 리프'}</TabPanel>
                    <TabPanel value="4">{'내가 저장한 리프'}</TabPanel>
                </TabContext>
            </Box>
        </>
    );
}
