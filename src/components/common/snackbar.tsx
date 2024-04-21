'use client';

import { useRecoilState } from 'recoil';
import { snackbarState } from '@/state/snackbarState';
import Snackbar from '@mui/material/Snackbar';

export default function CustomSnackbar() {
    const [snackbar, setSnackbar] = useRecoilState(snackbarState);

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            autoHideDuration={4000}
            open={snackbar !== ''}
            onClose={() => setSnackbar('')}
            message={snackbar}
        />
    );
}
