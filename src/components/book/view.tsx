'use client';

import { useEffect, useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { BookCard } from './book';
import type { BookSearchItemData, BookItem } from '@/app/api/books/type';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function ViewBook({ category }: { category: string }) {
    const { mode } = useColorScheme();
    const [books, setBooks] = useState<BookItem[]>([]);
    const [prevTab, setPrevTab] = useState<number>(1);
    const [nextTab, setNextTab] = useState<number>(1);

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

        const element = document.querySelector(
            `#${category}`
        ) as HTMLDivElement;
        const width = element.clientWidth - 80;
        const number = Math.floor(width / 174 / 2);
        setNextTab(number);
    }, [category]);

    const handlePrev = () => {
        if (prevTab < 1) {
            return;
        }

        const element = document.querySelector(
            `#${category} [tabindex='${prevTab - 1}']`
        ) as HTMLAnchorElement;
        element?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });

        setPrevTab((tab) => tab - 1);
        setNextTab(prevTab);
    };

    const handleNext = () => {
        if (nextTab > 9) {
            return;
        }

        const element = document.querySelector(
            `#${category} [tabindex='${nextTab + 1}']`
        ) as HTMLAnchorElement;
        element?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });

        setNextTab((tab) => tab + 1);
        setPrevTab(nextTab);
    };

    return (
        <Box
            width={'100%'}
            maxWidth={976}
            height={300}
            display={'flex'}
            alignItems={'center'}
            id={category}
        >
            <Box
                width={40}
                height={300}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                bgcolor={'background.paper'}
                borderRight={2}
                borderColor={'secondary.main'}
                color={'grey.500'}
                sx={{ cursor: 'pointer' }}
                onClick={handlePrev}
            >
                <ArrowBackIosNewIcon />
            </Box>
            <Stack
                width={'100%'}
                maxWidth={936}
                height={300}
                direction={'row'}
                spacing={1}
                overflow={'auto'}
                bgcolor={'background.paper'}
                sx={{
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgb(88, 143, 121) transparent',
                }}
            >
                {books.map((book, i) => (
                    <BookCard book={book} tabIndex={i} key={book.isbn13} />
                ))}
            </Stack>
            <Box
                width={40}
                height={300}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                bgcolor={'background.paper'}
                borderRight={2}
                borderColor={'secondary.main'}
                color={'grey.500'}
                sx={{ cursor: 'pointer' }}
                onClick={handleNext}
            >
                <ArrowForwardIosIcon />
            </Box>
        </Box>
    );
}
