import SearchBook from '@/components/book/search';
import ViewBook from '@/components/book/view';
import type { SearchCategory } from '../api/books/searchByCategory/route';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

interface Category {
    param: SearchCategory;
    title: string;
}

export default function Book() {
    const categories: Category[] = [
        { param: 'BlogBest', title: '화제의 책' },
        { param: 'ItemNewSpecial', title: '새로 나온 책' },
        { param: 'Bestseller', title: '베스트셀러' },
    ];

    return (
        <Stack direction={'column'} alignItems={'center'} spacing={4} mb={10}>
            <SearchBook />
            {categories.map((category) => (
                <Stack
                    direction={'column'}
                    alignItems={'center'}
                    spacing={2}
                    width={'100%'}
                    overflow={'auto'}
                    key={category.param}
                >
                    <Divider orientation="horizontal" flexItem>
                        {category.title}
                    </Divider>
                    <ViewBook category={category.param} />
                </Stack>
            ))}
        </Stack>
    );
}
