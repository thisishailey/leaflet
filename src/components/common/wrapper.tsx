import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Container
            component={'main'}
            sx={{
                position: 'relative',
                top: '82px',
                // width: '100%',
                maxWidth: '1024px',
                // height: '100%',
                minHeight: '100vh',
                margin: '0 auto',
                padding: '1rem',
                // paddingBottom: '50px',
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
    );
}
