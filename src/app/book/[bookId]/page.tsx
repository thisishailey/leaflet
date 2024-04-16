'use client';

import { useEffect, useState } from 'react';
import type { BookSearchItemData, BookItem } from '@/app/api/books/type';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Rating from '@mui/material/Rating';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Divider, Stack } from '@mui/material';
import Image from 'next/image';

export default function BookDetail({ params }: { params: { bookId: string } }) {
    const [book, setBook] = useState<BookItem>();

    useEffect(() => {
        const loadBook = async () => {
            const header = new Headers({ isbn: params.bookId });
            const res = await fetch('/api/books/searchByISBN', {
                headers: header,
            });

            const data: BookSearchItemData = await res.json();
            const item: BookItem = data.item[0];

            setBook(item);
        };

        loadBook();
    }, [params.bookId]);

    return (
        <>
            {book && (
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 976,
                        height: '100%',
                        // minHeight: 500,
                        p: 2,
                    }}
                >
                    <Breadcrumbs
                        separator={
                            <NavigateNextIcon sx={{ width: 16, height: 16 }} />
                        }
                    >
                        {book.categoryName.split('>').map((category) => (
                            <Typography key={category} fontSize={14}>
                                {category}
                            </Typography>
                        ))}
                    </Breadcrumbs>
                    <Stack
                        direction={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        spacing={2}
                        my={4}
                    >
                        <Typography
                            component={'h2'}
                            fontSize={28}
                            fontWeight={500}
                        >
                            {book.title}
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 0, md: 2 }}
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                        >
                            <Typography>{book.author}</Typography>
                            <Typography>{book.publisher}</Typography>
                            <Typography>{book.pubDate}</Typography>
                            {book.subInfo && (
                                <Typography>{`${book.subInfo.itemPage} 페이지`}</Typography>
                            )}
                        </Stack>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            alignItems={'center'}
                            spacing={{ xs: 2, md: 8 }}
                        >
                            <Box
                                position={'relative'}
                                width={200}
                                height={400}
                                flexShrink={0}
                            >
                                <Image
                                    src={book.cover}
                                    alt={book.title}
                                    priority
                                    fill
                                    objectFit="contain"
                                    quality={100}
                                />
                            </Box>
                            <Stack
                                direction={'column'}
                                justifyContent={'center'}
                                spacing={2}
                            >
                                {book.subInfo && (
                                    <Typography fontWeight={600}>
                                        {book.subInfo.bestSellerRank}
                                    </Typography>
                                )}
                                <Box display={'flex'} gap={1}>
                                    <Rating
                                        defaultValue={
                                            book.customerReviewRank / 2
                                        }
                                        precision={0.5}
                                        readOnly
                                    />
                                    <Typography>
                                        {`${book.customerReviewRank}점`}
                                    </Typography>
                                </Box>
                                <Typography>{book.description}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            )}
        </>
    );
}
