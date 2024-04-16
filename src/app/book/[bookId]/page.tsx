'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { BookSearchItemData, BookItem } from '@/app/api/books/type';
import { scrollToTop } from '@/util/common';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Paper, TextField } from '@mui/material';

export default function BookDetail({ params }: { params: { bookId: string } }) {
    const { push } = useRouter();
    const [book, setBook] = useState<BookItem>();
    const [rating, setRating] = useState<number | null>(3);

    useEffect(() => scrollToTop(), []);

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
                            width={'100%'}
                            maxWidth={944}
                            direction={{ xs: 'column', md: 'row' }}
                            alignItems={'center'}
                            justifyContent={'center'}
                            spacing={{ xs: 0.5, md: 2 }}
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                        >
                            <Typography noWrap maxWidth={300}>
                                {book.author}
                            </Typography>
                            <Stack
                                direction={'row'}
                                spacing={2}
                                divider={
                                    <Divider orientation="vertical" flexItem />
                                }
                            >
                                <Typography>{book.publisher}</Typography>
                                <Typography>{book.pubDate}</Typography>
                                {book.subInfo && (
                                    <Typography>{`${book.subInfo.itemPage} 페이지`}</Typography>
                                )}
                            </Stack>
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
                                sx={{ cursor: 'pointer' }}
                                onClick={() => push(book.link)}
                            >
                                <Image
                                    priority
                                    fill
                                    src={book.cover}
                                    alt={book.title}
                                    quality={100}
                                    style={{ objectFit: 'contain' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </Box>
                            <Stack
                                direction={'column'}
                                justifyContent={'center'}
                                spacing={1}
                            >
                                {book.subInfo && (
                                    <Typography
                                        fontWeight={600}
                                        color={'text.secondary'}
                                    >
                                        {book.subInfo.bestSellerRank}
                                    </Typography>
                                )}
                                <Tooltip
                                    title={'알라딘 평점'}
                                    placement="right"
                                    arrow
                                >
                                    <Box
                                        display={'flex'}
                                        gap={1}
                                        width={'max-content'}
                                    >
                                        <Rating
                                            defaultValue={
                                                book.customerReviewRank / 2
                                            }
                                            precision={0.5}
                                            readOnly
                                        />
                                        <Typography>{`${book.customerReviewRank}점`}</Typography>
                                    </Box>
                                </Tooltip>
                                <Typography
                                    pt={3}
                                    fontSize={18}
                                    fontWeight={500}
                                >
                                    {'요약'}
                                </Typography>
                                <Typography>{book.description}</Typography>
                            </Stack>
                        </Stack>
                        <Divider orientation="horizontal" flexItem />
                        <Stack
                            width={'100%'}
                            maxWidth={944}
                            pt={2}
                            direction={'column'}
                            alignItems={'center'}
                            spacing={4}
                        >
                            <Typography
                                component={'h4'}
                                fontSize={22}
                                fontWeight={500}
                            >
                                {'리플렛 평점 및 리뷰'}
                            </Typography>
                            <Stack
                                width={'100%'}
                                maxWidth={944}
                                direction={{ xs: 'column', md: 'row' }}
                                justifyContent={'space-around'}
                            >
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={1}
                                    width={'max-content'}
                                >
                                    <Rating
                                        defaultValue={5}
                                        precision={0.5}
                                        readOnly
                                        size="large"
                                        sx={{ color: 'primary.light' }}
                                    />
                                    <Typography>{'10점'}</Typography>
                                </Box>
                                <Typography>{`리뷰 0개`}</Typography>
                            </Stack>
                            <Paper
                                variant="outlined"
                                sx={{
                                    width: '100%',
                                    p: 2,
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 2,
                                }}
                            >
                                <Box width={'100%'}>
                                    <Rating
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setRating(newValue);
                                        }}
                                        precision={0.5}
                                        sx={{ color: 'primary.light' }}
                                    />
                                    <TextField fullWidth multiline rows={3} />
                                </Box>
                                <Stack
                                    direction={'column'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                >
                                    <Avatar />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            minWidth: 90,
                                        }}
                                    >
                                        {'리뷰 쓰기'}
                                    </Button>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stack>
                </Box>
            )}
        </>
    );
}
