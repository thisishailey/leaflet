'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { ModeSwitcher } from '@/styles/theme';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import SettingsIcon from '@mui/icons-material/Settings';

export default function BottomActionButtons() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleBackToTop = () => {
        const anchor = document.querySelector('#back-to-top-anchor');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const handleOpenSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseSetting = () => {
        setAnchorEl(null);
    };

    return (
        <div id="bottom-action-buttons">
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
                    onClick={handleOpenSetting}
                    color="secondary"
                    size="small"
                    sx={{
                        border: 1,
                        borderColor: 'grey.500',
                    }}
                >
                    <SettingsIcon />
                </Fab>
                <Popover
                    id={anchorEl ? 'website-setting-popover' : undefined}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleCloseSetting}
                    anchorOrigin={{
                        vertical: -15,
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    elevation={5}
                    slotProps={{ paper: { sx: { borderRadius: '8px' } } }}
                    disableScrollLock
                >
                    <Container sx={{ padding: '1.2rem' }}>
                        <Typography
                            component={'h4'}
                            fontWeight={600}
                            mb={'10px'}
                        >
                            {'화면 스타일'}
                        </Typography>
                        <ModeSwitcher />
                    </Container>
                </Popover>
            </Box>
        </div>
    );
}
