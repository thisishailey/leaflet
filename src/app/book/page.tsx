'use client';

import { useEffect } from 'react';
import SearchBook from '@/components/book/search';
import { Stack } from '@mui/material';

export default function Book() {
    // useEffect(() => {
    //     const loadBestseller = async () => {
    //         const header = new Headers({ category: 'Bestseller' });
    //         const res = await fetch('/api/books/searchByCategory', {
    //             headers: header,
    //         });
    //         const data = res.json();
    //         console.log(data);
    //     };

    //     loadBestseller();
    // }, []);

    return (
        <Stack direction={'column'} alignItems={'center'}>
            <SearchBook />
        </Stack>
    );
}
