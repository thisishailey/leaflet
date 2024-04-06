import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { HEADER_HEIGHT } from '../header/header';
import BottomActionButtons from './fab';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toolbar
                component={'span'}
                id="back-to-top-anchor"
                aria-hidden
                sx={{ height: HEADER_HEIGHT }}
            />
            <Container
                component={'main'}
                sx={{
                    maxWidth: '1024px',
                    minHeight: '100vh',
                    margin: '0 auto',
                    padding: '1rem',
                }}
            >
                {children}
                <BottomActionButtons />
            </Container>
        </>
    );
}
