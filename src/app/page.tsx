import Stack from '@mui/material/Stack';
import { SearchPost } from '@/components/common/searchbar';
import { WritePost } from '@/components/common/write';

export default function Home() {
    return (
        <Stack direction={'column'} alignItems={'center'} spacing={1}>
            <SearchPost />
            <WritePost />
        </Stack>
    );
}
