import type { Dispatch, SetStateAction } from 'react';
import Snackbar from '@mui/material/Snackbar';

interface Props {
    snackbar: string;
    setSnackbar: Dispatch<SetStateAction<string>>;
}

export default function CustomSnackbar({ snackbar, setSnackbar }: Props) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={4000}
            open={snackbar !== ''}
            onClose={() => setSnackbar('')}
            message={snackbar}
        />
    );
}
