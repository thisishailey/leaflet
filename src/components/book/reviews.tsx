'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useAuthContext } from '@/firebase/auth/state';
import addData from '@/firebase/db/addData';
import { type UserBasic, getUserProfile } from '@/firebase/db/getData';
import { type BookReview, getReviews } from '@/firebase/db/query';
import { type ReviewData, COLLECTION_REVIEW } from '@/firebase/db/model';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import SignInBanner from '../common/signinBanner';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface Props {
    setAlert: Dispatch<SetStateAction<string>>;
    setSnackbar: Dispatch<SetStateAction<string>>;
    bookId: string;
}

export default function BookReviews({ setAlert, setSnackbar, bookId }: Props) {
    const { user } = useAuthContext();

    const [reviews, setReviews] = useState<BookReview[]>([]);
    const [currentUser, setCurrentUser] = useState<UserBasic>();
    const [currentUserReview, setCurrentUserReview] =
        useState<BookReview | null>(null);

    const [reviewRatingAvg, setReviewRatingAvg] = useState<number>(0);
    const [reviewPage, setReviewPage] = useState(1);
    const [inputRating, setInputRating] = useState<number | null>(3);
    const [anonymous, setAnonymous] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadUser = async () => {
            const result = await getUserProfile(user.email as string);

            if (!result.data) {
                return setAlert('프로필 정보를 불러오지 못했습니다.');
            }

            setCurrentUser(result.data);
        };

        loadUser();
    }, [setAlert, user]);

    useEffect(() => {
        if (!bookId) {
            return;
        }

        const loadReviews = async () => {
            const reviews = await getReviews(bookId);

            if (reviews.length === 0) {
                return;
            }

            const ratingSum = reviews
                .map((review) => review.rating)
                .reduce((acc, cur) => acc + cur);
            const ratingAvg = ratingSum / reviews.length;

            setReviews(reviews);
            setReviewRatingAvg(Math.round(ratingAvg * 10) / 10);
        };

        loadReviews();
    }, [bookId]);

    useEffect(() => {
        if (!currentUser || reviews.length === 0) {
            return;
        }

        const review = reviews.find(
            (review) => review.email === currentUser.email
        );

        if (review) {
            setCurrentUserReview(review);
        } else {
            setCurrentUserReview(null);
        }
    }, [reviews, currentUser]);

    const handleAnonymousChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAnonymous(event.target.checked);
    };

    const handleReviewPageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setReviewPage(value);
    };

    const handleReviewSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const anonymous = data.get('anonymous') === 'on';
        const rating = parseFloat(data.get('rating') as string) * 2;
        const content = data.get('review') as string;

        const reviewData: ReviewData = {
            isbn: bookId,
            email: currentUser!.email as string,
            anonymous,
            rating,
            content,
        };

        const { error } = await addData(COLLECTION_REVIEW, reviewData);

        if (error) {
            return setAlert(error.message);
        }

        setSnackbar('리뷰가 등록되었습니다.');
    };

    return (
        <Stack
            width={'100%'}
            pt={2}
            direction={'column'}
            alignItems={'center'}
            spacing={4}
        >
            <Typography component={'h4'} fontSize={22} fontWeight={500}>
                {'리플렛 평점 및 리뷰'}
            </Typography>
            <Stack
                width={'100%'}
                maxWidth={944}
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-around'}
                divider={<Divider orientation="vertical" flexItem />}
            >
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    gap={1}
                    width={'max-content'}
                >
                    <Rating
                        value={Math.round(reviewRatingAvg) / 2}
                        precision={0.5}
                        readOnly
                        size="large"
                        sx={{ color: 'primary.light' }}
                    />
                    <Typography>
                        {reviews.length === 0
                            ? '평가 전'
                            : `${reviewRatingAvg}점`}
                    </Typography>
                </Box>
                <Typography>{`리뷰 ${reviews.length}개`}</Typography>
            </Stack>
            {!currentUser && (
                <SignInBanner nextAction={'하고 리뷰를 작성해 주세요.'} />
            )}
            {!currentUserReview && currentUser && (
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
                    component={'form'}
                    onSubmit={handleReviewSubmit}
                >
                    <Box width={'100%'}>
                        <Rating
                            name="rating"
                            value={inputRating}
                            onChange={(event, newValue) => {
                                setInputRating(newValue);
                            }}
                            precision={0.5}
                            sx={{ color: 'primary.light' }}
                        />
                        <TextField
                            name="review"
                            required
                            fullWidth
                            multiline
                            rows={3}
                            placeholder={'리뷰를 작성해 주세요.'}
                        />
                    </Box>
                    <Stack
                        direction={'column'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Avatar
                            src={anonymous ? '' : currentUser.profileSrc}
                            alt={currentUser.username}
                        >
                            {anonymous ? '' : currentUser.username.charAt(0)}
                        </Avatar>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="anonymous"
                                    onChange={handleAnonymousChange}
                                />
                            }
                            label="익명"
                            sx={{ mr: 0 }}
                            slotProps={{
                                typography: {
                                    fontSize: 14,
                                    fontWeight: 500,
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                minWidth: 90,
                            }}
                        >
                            {'리뷰 쓰기'}
                        </Button>
                    </Stack>
                </Paper>
            )}
            <Stack width={'100%'} direction={'column'} alignItems={'center'}>
                {reviews.length === 0 ? (
                    <Typography>{'아직 리뷰가 없습니다.'}</Typography>
                ) : (
                    reviews.map((review) => (
                        <Paper
                            key={review.email}
                            sx={{
                                width: '100%',
                                p: 2,
                                display: 'flex',
                                flexDirection: {
                                    xs: 'column',
                                    md: 'row',
                                },
                            }}
                        >
                            <Stack direction={'column'} width={'100%'}>
                                <Rating
                                    readOnly
                                    value={review.rating / 2}
                                    precision={0.5}
                                    sx={{ color: 'primary.light' }}
                                />
                                <Typography>{review.content}</Typography>
                            </Stack>
                            <Stack
                                direction={{ xs: 'row', md: 'column' }}
                                alignItems={{ xs: 'center', md: 'flex-end' }}
                                justifyContent={{
                                    xs: 'flex-end',
                                    md: 'normal',
                                }}
                                spacing={0.5}
                            >
                                <Avatar
                                    src={
                                        review.anonymous
                                            ? ''
                                            : review.profileSrc
                                    }
                                    alt={
                                        review.anonymous ? '' : review.username
                                    }
                                    sx={{ width: 28, height: 28 }}
                                >
                                    {review.anonymous
                                        ? ''
                                        : review.username?.charAt(0)}
                                </Avatar>
                                <Typography fontWeight={500}>
                                    {review.anonymous
                                        ? '익명'
                                        : review.username}
                                </Typography>
                                <Typography fontSize={12}>
                                    {review.date}
                                </Typography>
                            </Stack>
                        </Paper>
                    ))
                )}
                <Pagination
                    shape="rounded"
                    count={
                        reviews.length === 0 ? 1 : Math.ceil(reviews.length / 2)
                    }
                    page={reviewPage}
                    onChange={handleReviewPageChange}
                    sx={{ mt: 2 }}
                />
            </Stack>
        </Stack>
    );
}
