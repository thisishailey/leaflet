import Container from '@mui/material/Container';
import { SearchPost } from '@/components/common/searchbar';

export default function Home() {
    return (
        <Container sx={{ textAlign: 'center' }}>
            <SearchPost />
        </Container>
    );
}
