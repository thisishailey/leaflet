'use client';

import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import { HEADER_HEIGHT } from '../header/header';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    const handleBackToTop = () => {
        const anchor = document.querySelector('#back-to-top-anchor');
        if (anchor) {
            anchor.scrollIntoView();
        }
    };

    return (
        <>
            <Toolbar
                component={'span'}
                id="back-to-top-anchor"
                aria-hidden
                sx={{ height: HEADER_HEIGHT }}
            />
            <Container
                component={'main'}
                sx={{
                    maxWidth: '1024px',
                    minHeight: '100vh',
                    margin: '0 auto',
                    padding: '1rem',
                }}
            >
                {children}
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        display: 'flex',
                        gap: '10px',
                    }}
                >
                    <Fab
                        aria-label="scroll back to top"
                        onClick={handleBackToTop}
                        color="secondary"
                        size="small"
                        sx={{
                            border: 1,
                            borderColor: 'grey.500',
                        }}
                    >
                        <VerticalAlignTopRoundedIcon />
                    </Fab>
                    <Fab
                        aria-label="website settings"
                        color="secondary"
                        size="small"
                        sx={{
                            border: 1,
                            borderColor: 'grey.500',
                        }}
                    >
                        <SettingsIcon />
                    </Fab>
                </Box>
            </Container>
        </>
    );
}
