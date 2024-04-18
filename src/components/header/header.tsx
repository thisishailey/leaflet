'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/firebase/auth/state';
import { useColorScheme } from '@mui/material/styles';
import { type UserBasic, getUserProfile } from '@/firebase/db/getData';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import logo from '@/assets/logo/logo.png';
import logoWhite from '@/assets/logo/logo-white.png';
import logoBlack from '@/assets/logo/logo-black.png';

type TabGroup = 'social' | 'user';
type Tab = '리프' | '도서' | '서점' | '알림' | '메세지' | '팔로잉';

const tabs: { name: Tab; link: string }[] = [
    { name: '리프', link: '/' },
    { name: '도서', link: '/book' },
    { name: '서점', link: '/bookstore' },
    { name: '알림', link: '/user/notification' },
    { name: '메세지', link: '/user/message' },
    { name: '팔로잉', link: '/user/following' },
];
const socialTabs = tabs.slice(0, 3);
const userTabs = tabs.slice(3);

export const HEADER_HEIGHT = '64px';

export default function Header() {
    const { user } = useAuthContext();
    const { mode } = useColorScheme();
    const pathname = usePathname();

    const [currentTabGroup, setCurrentTabGroup] = useState<TabGroup>('social');
    const [currentTab, setCurrentTab] = useState<Tab | null>(null);
    const [currentUser, setCurrentUser] = useState<UserBasic>();

    useEffect(() => {
        if (pathname.startsWith('/user')) {
            if (currentTabGroup !== 'user') {
                setCurrentTabGroup('user');
            }
        } else {
            if (currentTabGroup !== 'social') {
                setCurrentTabGroup('social');
            }
        }

        if (pathname.startsWith('/auth')) {
            return setCurrentTab(null);
        }

        const tab = tabs.findLast((tab) => pathname.startsWith(tab.link));
        if (tab) {
            if (currentTab !== tab.name) {
                setCurrentTab(tab.name);
            }
        } else {
            setCurrentTab(null);
        }
    }, [pathname, currentTabGroup, currentTab]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadUser = async () => {
            const result = await getUserProfile(user.email as string);
            if (result.data) {
                setCurrentUser(result.data);
            }
        };

        loadUser();
    }, [user]);

    return (
        <AppBar
            enableColorOnDark
            position="fixed"
            color={currentTabGroup === 'social' ? 'default' : 'primary'}
            sx={{ backgroundImage: 'var(--mui-overlays-2)', boxShadow: 3 }}
        >
            <Toolbar
                sx={{
                    width: '100%',
                    maxWidth: '1024px',
                    height: HEADER_HEIGHT,
                    margin: '0 auto',
                    padding: '0.5rem',
                }}
            >
                <Link href={'/'} style={{ height: 40 }}>
                    <Box component={'h1'} width={40} height={40} m={0}>
                        <Image
                            src={
                                currentTabGroup === 'social'
                                    ? logo.src
                                    : mode === 'light'
                                    ? logoWhite.src
                                    : logoBlack.src
                            }
                            alt="Leaflet"
                            width={40}
                            height={40}
                            priority
                        />
                    </Box>
                </Link>
                <Stack
                    direction="row"
                    justifyContent={{ xs: 'space-around', md: 'center' }}
                    spacing={{ xs: 0, md: 20 }}
                    width={'100%'}
                >
                    {currentTabGroup === 'social' &&
                        socialTabs.map((tab) => {
                            return (
                                <Link href={tab.link} key={tab.name}>
                                    <Box
                                        margin={0}
                                        fontSize={20}
                                        fontWeight={
                                            currentTab === tab.name ? 600 : 400
                                        }
                                        color={
                                            currentTab !== tab.name
                                                ? 'inherit'
                                                : mode === 'light'
                                                ? 'primary.main'
                                                : 'primary.light'
                                        }
                                    >
                                        {tab.name}
                                    </Box>
                                </Link>
                            );
                        })}
                    {currentTabGroup === 'user' &&
                        userTabs.map((tab) => {
                            return (
                                <Link href={tab.link} key={tab.name}>
                                    <Box
                                        margin={0}
                                        fontSize={20}
                                        fontWeight={
                                            currentTab === tab.name ? 600 : 400
                                        }
                                    >
                                        {tab.name}
                                    </Box>
                                </Link>
                            );
                        })}
                </Stack>
                <Link
                    href={
                        user === null
                            ? '/auth/signin'
                            : currentTabGroup === 'social'
                            ? '/user/following'
                            : '/user'
                    }
                >
                    {currentUser ? (
                        <Avatar
                            src={currentUser.profileSrc}
                            alt={currentUser.username}
                        >
                            {currentUser.username.charAt(0)}
                        </Avatar>
                    ) : (
                        <Avatar
                            sx={
                                currentTabGroup === 'social'
                                    ? {
                                          bgcolor: 'primary.light',
                                          color: 'secondary.main',
                                      }
                                    : {
                                          bgcolor: 'primary.dark',
                                          color: 'secondary.main',
                                      }
                            }
                        />
                    )}
                </Link>
            </Toolbar>
        </AppBar>
    );
}
