import { styled } from '@mui/material/styles';

export const Wrapper = styled('div', {
    name: 'MuiWrapper',
    slot: 'root',
})(() => ({
    width: '100vw',
    minHeight: '100vh',
}));
