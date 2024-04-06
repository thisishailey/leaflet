'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useColorScheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import logo from '@/assets/logo/logo.png';
import logoWhite from '@/assets/logo/logo-white.png';
import logoBlack from '@/assets/logo/logo-black.png';

const socialTabs = [
    { name: '리프', link: '/' },
    { name: '도서', link: '/book' },
    { name: '서점', link: '/bookstore' },
];
const userTabs = [
    { name: '알림', link: '/profile/notification' },
    { name: '메세지', link: '/profile/message' },
    { name: '팔로잉', link: '/profile/following' },
];
type TabGroups = 'social' | 'user';

export const HEADER_HEIGHT = '64px';

export default function Header() {
    const [currentTabGroup, setCurrentTabGroup] = useState<TabGroups>('social');
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
                    href={'/profile'}
                    onClick={() => {
                        setCurrentTabGroup('user');
                    }}
                >
                    <Avatar />
                </Link>
            </Toolbar>
        </AppBar>
    );
}
