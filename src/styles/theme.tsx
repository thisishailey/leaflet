'use client';

import { useEffect, useState } from 'react';
import {
    experimental_extendTheme as extendTheme,
    useColorScheme,
} from '@mui/material/styles';
import Button from '@mui/material/Button';
import { noto_sans } from '@/styles/font';

export const theme = extendTheme({
    typography: { fontFamily: noto_sans.style.fontFamily },
    colorSchemes: {
        light: {
            palette: {
                primary: { main: '#2F7458' },
                background: { default: '#fafafa' },
                text: { primary: '#101010', secondary: '#2F7458' },
            },
        },
        dark: {
            palette: {
                primary: { main: '#2F7458' },
                background: { default: '#101010' },
                text: { primary: '#fafafa', secondary: '#2F7458' },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 480,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
});

export const ModeSwicher = () => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
            }}
        >
            {mode}
        </Button>
    );
};
