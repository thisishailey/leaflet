'use client';

import { styled } from '@mui/material/styles';

export const FooterRoot = styled('header', { name: 'MuiFooter', slot: 'root' })(
    () => ({ display: 'flex', justifyContent: 'space-between', width: '100%' })
);
