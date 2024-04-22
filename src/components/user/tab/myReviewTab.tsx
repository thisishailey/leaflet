'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type MyReview, getReviewsByUserId } from '@/firebase/db/query';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '@/state/snackbarState';
import { getFormattedDate } from '@/util/datetime';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SkeletonPreviews from './skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';

interface Props {
    email: string;
}

export default function MyReviews({ email }: Props) {
    const setSnackbar = useSetRecoilState(snackbarState);
    const [reviews, setReviews] = useState<MyReview[]>([]);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadMyReviews = async () => {
            setLoading(true);

            const { result, isEmpty } = await getReviewsByUserId(email);

            if (isEmpty) {
                setIsEmpty(true);
                return setLoading(false);
            }

            setReviews(result);
            setLoading(false);
        };

        loadMyReviews();
    }, [email]);

    return (
        <Stack direction={'column'} spacing={2}>
            {loading && <SkeletonPreviews />}
            {isEmpty && (
                <Typography textAlign={'center'}>
                    {'아직 작성한 리프가 없습니다.'}
                </Typography>
            )}
            {reviews.map((review) => (
                <Paper key={review.isbn}>
                    <Stack direction={'column'} spacing={1} p={2} pt={1}>
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                        >
                            <Typography fontSize={14}>
                                {getFormattedDate(review.timestamp!.toDate())}
                            </Typography>
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </Stack>
                        <Link href={`/book/${review.isbn}`}>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                spacing={2}
                                mb={2}
                            >
                                <Avatar src={review.cover} alt={review.title} />
                                <Typography fontWeight={500} fontSize={18}>
                                    {review.title}
                                </Typography>
                            </Stack>
                            <Typography
                                color={'primary'}
                                mb={1}
                            >{`평점 ${review.rating}점`}</Typography>
                            <Typography>{review.content}</Typography>
                        </Link>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}
