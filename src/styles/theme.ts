import { createTheme } from '@mui/material';
import { noto_sans } from '@/styles/font';

export const theme = createTheme({
    typography: { fontFamily: noto_sans.style.fontFamily },
});
