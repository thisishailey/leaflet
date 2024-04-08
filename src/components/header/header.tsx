'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthContext } from '@/firebase/auth/state';
import { useColorScheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import logo from '@/assets/logo/logo.png';
import logoWhite from '@/assets/logo/logo-white.png';
import logoBlack from '@/assets/logo/logo-black.png';

type TabGroup = 'social' | 'user';

const socialTabs = [
    { name: '리프', link: '/' },
    { name: '도서', link: '/book' },
    { name: '서점', link: '/bookstore' },
];
const userTabs = [
    { name: '알림', link: '/user/notification' },
    { name: '메세지', link: '/user/message' },
    { name: '팔로잉', link: '/user/following' },
];

export const HEADER_HEIGHT = '64px';

export default function Header() {
    const [currentTabGroup, setCurrentTabGroup] = useState<TabGroup>('social'); // FIXME need to determine currentTabGroup based on a path ('/user' path => 'user', else => 'social')
    const { user } = useAuthContext();
    const { mode } = useColorScheme();

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
                {currentTabGroup === 'social' && (
                    <Container
                        sx={{
                            display: 'flex',
                            gap: { xs: '0', md: '8rem' },
                            justifyContent: {
                                xs: 'space-around',
                                md: 'center',
                            },
                        }}
                    >
                        {socialTabs.map((tab) => {
                            return (
                                <Link href={tab.link} key={tab.name}>
                                    <Box
                                        component={'h2'}
                                        fontSize={'20px'}
                                        fontWeight={500}
                                        margin={0}
                                    >
                                        {tab.name}
                                    </Box>
                                </Link>
                            );
                        })}
                    </Container>
                )}
                {currentTabGroup === 'user' && (
                    <Container
                        sx={{
                            display: 'flex',
                            gap: { xs: '0', md: '8rem' },
                            justifyContent: {
                                xs: 'space-around',
                                md: 'center',
                            },
                        }}
                    >
                        {userTabs.map((tab) => {
                            return (
                                <Link href={tab.link} key={tab.name}>
                                    <Box
                                        component={'h2'}
                                        fontSize={'20px'}
                                        fontWeight={500}
                                        margin={0}
                                    >
                                        {tab.name}
                                    </Box>
                                </Link>
                            );
                        })}
                    </Container>
                )}
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
