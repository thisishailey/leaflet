'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import logo from '@/assets/logo/logo.png';

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

export default function Header() {
    const [currentTabGroup, setCurrentTabGroup] = useState<TabGroups>('social');

    return (
        <AppBar
            color="default"
            position="fixed"
            sx={{ backgroundImage: 'var(--mui-overlays-2)' }}
        >
            <Toolbar
                sx={{
                    width: '100%',
                    maxWidth: '1024px',
                    margin: '0 auto',
                    padding: '1rem',
                }}
            >
                <Link
                    href={'/'}
                    style={{ height: '50px' }}
                    onClick={() => {
                        setCurrentTabGroup('social');
                    }}
                >
                    <Image
                        src={logo.src}
                        alt="Leaflet"
                        width={'50'}
                        height={'50'}
                        priority
                    />
                </Link>
                {currentTabGroup === 'social' && (
                    <Container
                        sx={{
                            display: 'flex',
                            gap: { xs: '0', md: '6rem' },
                            justifyContent: {
                                xs: 'space-around',
                                md: 'center',
                            },
                            marginRight: {
                                xs: '0',
                                sm: '50px',
                                md: '100px',
                                lg: '150px',
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
                            gap: { xs: '0', md: '6rem' },
                            justifyContent: {
                                xs: 'space-around',
                                md: 'center',
                            },
                            marginLeft: {
                                xs: '0',
                                sm: '50px',
                                md: '100px',
                                lg: '150px',
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
