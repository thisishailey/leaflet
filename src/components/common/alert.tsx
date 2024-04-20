import { Dispatch, ReactNode, SetStateAction } from 'react';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

interface Props {
    alert: string | ReactNode;
    setAlert:
        | Dispatch<SetStateAction<string>>
        | Dispatch<SetStateAction<ReactNode>>;
}

export default function CustomAlert({ alert, setAlert }: Props) {
    return (
        <Fade
            in={alert !== ''}
            addEndListener={() =>
                setTimeout(() => {
                    setAlert('');
                }, 4000)
            }
        >
            <Alert
                severity={'error'}
                sx={{
                    width: '100%',
                    maxWidth: 976,
                    mb: 2,
                    display: alert ? 'flex' : 'none',
                }}
            >
                {alert}
            </Alert>
        </Fade>
    );
}
