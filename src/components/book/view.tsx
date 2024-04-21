'use client';

import { useEffect, useState } from 'react';
import type { BookSearchItemData, BookItem } from '@/app/api/books/type';
import { BookCard } from './book';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function ViewBook({ category }: { category: string }) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [prevTab, setPrevTab] = useState<number>(1);
    const [nextTab, setNextTab] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);

            const header = new Headers({ category: category });
            const res = await fetch('/api/books/searchByCategory', {
                headers: header,
            });

            const data: BookSearchItemData = await res.json();
            const items: BookItem[] = data.item;

            setBooks(items);
            setLoading(false);
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
                {loading && <SkeletonBookCards />}
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

function SkeletonBookCards() {
    return (
        <>
            <SkeletonBookCard />
            <SkeletonBookCard />
            <SkeletonBookCard />
            <SkeletonBookCard />
            <SkeletonBookCard />
            <SkeletonBookCard />
        </>
    );
}

function SkeletonBookCard() {
    return (
        <Stack
            direction={'column'}
            alignItems={'center'}
            minWidth={170}
            height={280}
            pt={2}
        >
            <Skeleton variant="rectangular" width={120} height={160} />
            <Skeleton variant="text" width={140} height={50} />
            <Skeleton variant="text" width={140} height={20} />
            <Skeleton variant="text" width={140} height={20} />
        </Stack>
    );
}
