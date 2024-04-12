import Stack from '@mui/material/Stack';
import { SearchPost } from '@/components/common/search';
import { WritePost } from '@/components/post/write';
import ViewPost from '@/components/post/view';

export default function Home() {
    return (
        <Stack direction={'column'} alignItems={'center'} spacing={1}>
            <SearchPost />
            <WritePost />
            <ViewPost />
        </Stack>
    );
}
