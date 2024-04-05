'use client';

import { useEffect, useState } from 'react';
import {
    experimental_extendTheme as extendTheme,
    useColorScheme,
} from '@mui/material/styles';
import Button from '@mui/material/Button';
import { noto_sans } from '@/styles/font';

const COLOR = {
    WHITE: '#fafafa',
    BLACK: '#1e1e1e',
    THEME: '#2F7458',
};

export const theme = extendTheme({
    typography: { fontFamily: noto_sans.style.fontFamily },
    colorSchemes: {
        light: {
            palette: {
                primary: { main: COLOR.THEME },
                secondary: { main: COLOR.WHITE },
                background: { default: COLOR.WHITE },
                text: { primary: COLOR.BLACK, secondary: COLOR.THEME },
            },
        },
        dark: {
            palette: {
                primary: { main: COLOR.THEME },
                secondary: { main: COLOR.BLACK },
                background: { default: COLOR.BLACK },
                text: { primary: COLOR.WHITE, secondary: COLOR.THEME },
            },
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
				a {
					color: inherit;
					text-decoration: none;
				}
			`,
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
