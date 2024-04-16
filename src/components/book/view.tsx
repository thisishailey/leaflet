'use client';

import { useEffect, useState } from 'react';
import { BookCard } from './book';
import type { BookSearchItemData, BookItem } from '@/app/api/books/type';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function ViewBook({ category }: { category: string }) {
    const [books, setBooks] = useState<BookItem[]>([]);

    useEffect(() => {
        const loadBooks = async () => {
            const header = new Headers({ category: category });
            const res = await fetch('/api/books/searchByCategory', {
                headers: header,
            });

            const data: BookSearchItemData = await res.json();
            const items: BookItem[] = data.item;

            setBooks(items);
        };

        loadBooks();
    }, [category]);

    return (
        <Stack direction={'row'} spacing={1} width={'100%'} overflow={'auto'}>
            {books &&
                books.map((book) => <BookCard key={book.isbn13} book={book} />)}
        </Stack>
    );
}
