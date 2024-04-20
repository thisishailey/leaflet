'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/firebase/auth/state';
import {
    type PostDetail,
    type CommentDetail,
    getPost,
    getComments,
} from '@/firebase/db/getData';
import {
    type CurrentUserPost,
    getCurrentUserOnPost,
} from '@/firebase/db/getData';
import { addComment } from '@/firebase/db/addData';
import {
    updateBookmark,
    updateComment,
    updateLike,
} from '@/firebase/db/updateData';
import { emptyValue, scrollToTop } from '@/util/common';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CustomAlert from '@/components/common/alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';

export default function Post({ params }: { params: { postId: string } }) {
    const { user } = useAuthContext();
    const [alert, setAlert] = useState<React.ReactNode>('');

    const [currentUser, setCurrentUser] = useState<CurrentUserPost>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

    const [post, setPost] = useState<PostDetail>();
    const [likesCount, setLikesCount] = useState<number>(0);
    const [comments, setComments] = useState<CommentDetail[]>([]);

    useEffect(() => scrollToTop(), []);

    useEffect(() => {
        if (!user) {
            return;
        }

        const getCurrentUser = async () => {
            const result = await getCurrentUserOnPost(
                user.email as string,
                params.postId
            );

            if (result.error) {
                return setAlert('회원 정보를 불러오지 못했습니다.');
            }

            setCurrentUser(result.data as CurrentUserPost);
            setIsLiked(result.data?.like || false);
            setIsBookmarked(result.data?.bookmark || false);
        };

        getCurrentUser();
    }, [params.postId, user]);

    useEffect(() => {
        const loadPost = async () => {
            const result = await getPost(params.postId);

            if (result.error) {
                return setAlert('게시글을 불러오지 못했습니다.');
            }

            setPost(result.data as PostDetail);
            setLikesCount(result.data?.likes || 0);
            setComments(result.data?.comments || []);
        };

        loadPost();
    }, [params.postId]);

    const needSignIn = (
        <>
            {'로그인이 필요합니다.'}
            <Link href={{ pathname: '/auth/signin', query: { back: true } }}>
                <Typography
                    component={'span'}
                    fontSize={13}
                    fontWeight={500}
                    ml={5}
                >
                    {'로그인하러 가기'}
                </Typography>
            </Link>
        </>
    );

    const handleLike = async () => {
        if (!currentUser) {
            return setAlert(needSignIn);
        }

        const { error } = await updateLike(
            currentUser.email,
            params.postId as string,
            isLiked
        );

        if (error) {
            return setAlert(error.message);
        }

        if (isLiked) {
            setLikesCount((likes) => likes - 1);
        } else {
            setLikesCount((likes) => likes + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleBookmark = async () => {
        if (!currentUser) {
            return setAlert(needSignIn);
        }

        const { error } = await updateBookmark(
            currentUser?.email as string,
            params.postId as string,
            isBookmarked
        );

        if (error) {
            return setAlert(error.message);
        }

        setIsBookmarked(!isBookmarked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!currentUser) {
            return setAlert(needSignIn);
        }

        const data = new FormData(event.currentTarget);
        const comment = data.get('new-comment') as string;

        const { commentId } = await addComment({
            content: comment,
            email: currentUser.email,
        });

        if (!commentId) {
            return setAlert('댓글을 작성하지 못했습니다.');
        }

        const { error } = await updateComment(params.postId, commentId);

        if (error) {
            return setAlert(error.message);
        }

        const newComment = await getComments([commentId]);

        emptyValue('#new-comment');
        setComments(comments.concat(newComment));
    };

    return (
        <>
            <style>{`footer {display: none;} #bottom-action-buttons {display: none;}`}</style>
            <CustomAlert alert={alert} setAlert={setAlert} />
            <Paper
                variant="outlined"
                sx={{ minHeight: 200, px: 2, py: 1.5, borderRadius: 4 }}
            >
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Stack
                        direction={'row'}
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                        spacing={2}
                    >
                        <Avatar
                            src={post?.profileSrc}
                            alt={post?.username}
                            sx={{ width: 28, height: 28 }}
                        >
                            {post?.username?.charAt(0)}
                        </Avatar>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            alignItems={'baseline'}
                            spacing={{ xs: 0, md: 3 }}
                        >
                            <Typography fontSize={18} fontWeight={600}>
                                {post?.username}
                            </Typography>
                            <Typography fontSize={14} color={'primary.main'}>
                                {post?.elapsedTime}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} spacing={1}>
                        <IconButton
                            size="large"
                            color={isLiked ? 'error' : 'default'}
                            onClick={handleLike}
                        >
                            {isLiked ? (
                                <FavoriteIcon />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>
                        <IconButton
                            size="large"
                            color={isBookmarked ? 'info' : 'default'}
                            onClick={handleBookmark}
                        >
                            {isBookmarked ? (
                                <BookmarkIcon />
                            ) : (
                                <BookmarkBorderIcon />
                            )}
                        </IconButton>
                        <IconButton size="large">
                            <MoreVertIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <Divider aria-hidden="true" sx={{ py: 0.5 }} />
                <Box px={{ xs: 0, md: 2 }} py={{ xs: 2, md: 3 }}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post?.content || '',
                        }}
                    ></div>
                </Box>
                <Grid container gap={2} m={1}>
                    {post?.images.map((image) => (
                        <Avatar
                            key={image}
                            src={image}
                            variant="square"
                            sx={{
                                width: '100%',
                                maxWidth: 300,
                                height: '100%',
                                maxHeight: 300,
                            }}
                        />
                    ))}
                </Grid>
            </Paper>
            <Paper
                variant="outlined"
                sx={{ minHeight: 200, mt: 2, p: 2, borderRadius: 4 }}
            >
                <Stack
                    direction={'row'}
                    spacing={2}
                    mb={2}
                    px={1}
                    divider={
                        <Divider
                            orientation="vertical"
                            aria-hidden="true"
                            flexItem
                        />
                    }
                >
                    <Typography
                        fontSize={14}
                    >{`댓글 ${comments.length}개`}</Typography>
                    <Typography
                        fontSize={14}
                    >{`좋아요 ${likesCount}개`}</Typography>
                </Stack>
                {comments.map((comment, i) => (
                    <Card
                        key={i}
                        elevation={0}
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Divider aria-hidden="true" />
                        <CardHeader
                            avatar={
                                <Avatar
                                    src={comment.profileSrc}
                                    alt={comment.username}
                                    sx={{ width: 24, height: 24 }}
                                >
                                    {comment.username.charAt(0)}
                                </Avatar>
                            }
                            action={
                                <IconButton>
                                    <MoreHorizIcon />
                                </IconButton>
                            }
                            title={comment.username}
                            subheader={comment.elapsedTime}
                            titleTypographyProps={{
                                sx: {
                                    display: 'inline',
                                    fontWeight: 500,
                                    fontSize: 16,
                                },
                            }}
                            subheaderTypographyProps={{
                                sx: { display: 'inline', ml: 2 },
                            }}
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: comment.content,
                                }}
                            ></div>
                        </CardContent>
                    </Card>
                ))}
            </Paper>
            <Box height={200} />
            <Box
                position={'fixed'}
                bottom={20}
                left={'50%'}
                sx={{
                    transform: 'translateX(-50%)',
                }}
                width={'100%'}
                maxWidth={950}
                p={2}
            >
                <Paper
                    component={'form'}
                    variant="outlined"
                    onSubmit={handleSubmit}
                    sx={{
                        p: 2,
                        borderRadius: 4,
                        borderColor: 'primary.main',
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <TextField
                        autoFocus
                        fullWidth
                        required
                        multiline
                        rows={4}
                        id="new-comment"
                        name="new-comment"
                        disabled={Boolean(!currentUser)}
                        placeholder={
                            currentUser
                                ? '댓글을 작성해 주세요.'
                                : '로그인 후 댓글을 작성해 주세요.'
                        }
                        InputProps={{ sx: { borderRadius: 3 } }}
                    />
                    <Stack
                        direction={'column'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        spacing={1}
                    >
                        <Avatar
                            src={currentUser?.profileSrc}
                            alt={currentUser?.username}
                        >
                            {currentUser?.username?.charAt(0)}
                        </Avatar>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            sx={{
                                minWidth: 40,
                                height: 40,
                                p: 1,
                                borderRadius: 3,
                            }}
                        >
                            <SendIcon />
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </>
    );
}
