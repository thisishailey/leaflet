'use client';

import { styled } from '@mui/material/styles';

export const Wrapper = styled('div', {
    name: 'MuiWrapper',
    slot: 'root',
})(({ theme }) => ({
    position: 'relative',
    top: '70px',
    maxWidth: `${theme.breakpoints.values.lg}px`,
    minHeight: '100vh',
    margin: '0 auto',
    padding: '1rem',
}));
