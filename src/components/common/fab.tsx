'use client';

import { useState } from 'react';
import { scrollToTop } from '@/util/common';
import { ModeSwitcher } from '@/styles/theme';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SettingsIcon from '@mui/icons-material/Settings';

export default function BottomActionButtons() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleOpenSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseSetting = () => {
        setAnchorEl(null);
    };

    return (
        <div id="bottom-action-buttons">
            <Box
                position={'fixed'}
                bottom={30}
                right={30}
                display={'flex'}
                gap={1}
            >
                <Tooltip title="맨 위로" placement="top">
                    <Fab
                        size="small"
                        color="secondary"
                        onClick={scrollToTop}
                        sx={{
                            border: 1,
                            borderColor: 'grey.500',
                        }}
                        aria-label="scroll back to top"
                    >
                        <KeyboardArrowUpIcon />
                    </Fab>
                </Tooltip>
                <Tooltip title="환경설정" placement="top">
                    <Fab
                        size="small"
                        color="secondary"
                        onClick={handleOpenSetting}
                        sx={{
                            border: 1,
                            borderColor: 'grey.500',
                        }}
                        aria-label="website settings"
                    >
                        <SettingsIcon />
                    </Fab>
                </Tooltip>
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
                    slotProps={{ paper: { sx: { borderRadius: 2 } } }}
                    disableScrollLock
                >
                    <Container sx={{ padding: 2 }}>
                        <Typography fontWeight={600} mb={2}>
                            {'화면 스타일'}
                        </Typography>
                        <ModeSwitcher />
                    </Container>
                </Popover>
            </Box>
        </div>
    );
}
