// TODO add loading skeleton
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { BookSearchItemData, BookItem } from '@/app/api/books/type';
import { scrollToTop } from '@/util/common';

import BookReviews from '@/components/book/reviews';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CustomAlert from '@/components/common/alert';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function BookDetail({ params }: { params: { bookId: string } }) {
    const { push } = useRouter();
    const [alert, setAlert] = useState<string>('');
    const [book, setBook] = useState<BookItem>();

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
            <CustomAlert alert={alert} setAlert={setAlert} />
            {book && (
                <Box width={'100%'} maxWidth={976} height={'100%'} p={2}>
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
                                            value={book.customerReviewRank / 2}
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
                        <BookReviews
                            setAlert={setAlert}
                            bookId={params.bookId}
                        />
                    </Stack>
                </Box>
            )}
        </>
    );
}
