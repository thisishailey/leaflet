'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/firebase/auth/state';
import { useColorScheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
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
    const [currentTabGroup, setCurrentTabGroup] = useState<TabGroup>('social');
    const [currentTab, setCurrentTab] = useState<Tab>();
    const { user } = useAuthContext();
    const { mode } = useColorScheme();

    const pathname = usePathname();
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

        const tab = tabs.findLast((tab) => pathname.startsWith(tab.link));
        if (tab) {
            if (currentTab !== tab.name) {
                setCurrentTab(tab.name);
            }
        } else {
            setCurrentTab(undefined);
        }
    }, [pathname, currentTabGroup, currentTab]);

    return (
        <AppBar
            enableColorOnDark
            color={currentTabGroup === 'social' ? 'default' : 'primary'}
            position="fixed"
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
                <Link
                    href={'/'}
                    style={{ height: '40px' }}
                    onClick={() => {
                        setCurrentTabGroup('social');
                    }}
                >
                    <Image
                        src={
                            currentTabGroup === 'social'
                                ? logo.src
                                : mode === 'light'
                                ? logoWhite.src
                                : logoBlack.src
                        }
                        alt="Leaflet"
                        width={'40'}
                        height={'40'}
                        priority
                    />
                </Link>
                <Stack
                    direction="row"
                    width={'100%'}
                    spacing={{ xs: 0, md: 20 }}
                    justifyContent={{ xs: 'space-around', md: 'center' }}
                >
                    {currentTabGroup === 'social' &&
                        socialTabs.map((tab) => {
                            return (
                                <Link href={tab.link} key={tab.name}>
                                    <Box
                                        component={'h2'}
                                        margin={0}
                                        fontSize={'20px'}
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
                                        component={'h2'}
                                        margin={0}
                                        fontSize={'20px'}
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
                    onClick={() => {
                        user && setCurrentTabGroup('user');
                    }}
                >
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
                </Link>
            </Toolbar>
        </AppBar>
    );
}
