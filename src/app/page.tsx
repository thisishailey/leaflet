import Stack from '@mui/material/Stack';
import { SearchPost } from '@/components/common/search';
import { WritePost } from '@/components/common/write';

export default function Home() {
    return (
        <Stack direction={'column'} alignItems={'center'} spacing={1}>
            <SearchPost />
            <WritePost />
        </Stack>
    );
}
