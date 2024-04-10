'use client';

import { useEffect, useState } from 'react';
import {
    experimental_extendTheme as extendTheme,
    useColorScheme,
} from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import NightlightIcon from '@mui/icons-material/Nightlight';
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
                info: { main: COLOR.BLACK },
                background: { default: COLOR.WHITE },
                text: { primary: COLOR.BLACK, secondary: COLOR.THEME },
            },
        },
        dark: {
            palette: {
                primary: { main: COLOR.THEME },
                secondary: { main: COLOR.BLACK },
                info: { main: COLOR.WHITE },
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
				p {
					margin: 0;
				}
				#editor * {
					outline: 0;
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

type Mode = 'light' | 'system' | 'dark';

const modeButton = [
    { value: 'light', icon: <LightModeIcon />, name: '라이트 모드' },
    { value: 'system', icon: <SettingsBrightnessIcon />, name: '시스템 설정' },
    { value: 'dark', icon: <NightlightIcon />, name: '다크 모드' },
];

export const ModeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { mode, setMode } = useColorScheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newMode: Mode
    ) => {
        setMode(newMode);
    };

    return (
        <ToggleButtonGroup
            exclusive
            color="primary"
            value={mode}
            onChange={handleModeChange}
            aria-label="Mode"
        >
            {modeButton.map((mode) => {
                return (
                    <ToggleButton
                        key={mode.value}
                        value={mode.value}
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                        {mode.icon}
                        <Typography
                            fontSize={'14px'}
                            fontWeight={500}
                            mt={'8px'}
                        >
                            {mode.name}
                        </Typography>
                    </ToggleButton>
                );
            })}
        </ToggleButtonGroup>
    );
};
