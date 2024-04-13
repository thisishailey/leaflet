'use client';

import { useEffect, useState } from 'react';
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
import { emptyValue } from '@/util/util';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
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

    const [alert, setAlert] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<CurrentUserPost>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [post, setPost] = useState<PostDetail>();
    const [likesCount, setLikesCount] = useState<number>(0);
    const [comments, setComments] = useState<CommentDetail[]>([]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const getCurrentUser = async () => {
            const { currentUser, error } = await getCurrentUserOnPost(
                user.email as string,
                params.postId
            );

            if (error) {
                return setAlert('회원 정보를 불러오지 못했습니다.');
            }

            setAlert('');
            setCurrentUser(currentUser as CurrentUserPost);
            setIsLiked(currentUser?.like || false);
            setIsBookmarked(currentUser?.bookmark || false);
        };

        getCurrentUser();
    }, [params.postId, user]);

    useEffect(() => {
        const loadPost = async () => {
            const { post, error } = await getPost(params.postId);

            if (error) {
                return setAlert('게시글을 불러오지 못했습니다.');
            }

            setAlert('');
            setPost(post as PostDetail);
            setLikesCount(post?.likes || 0);
            setComments(post?.comments || []);
        };

        loadPost();
    }, [params.postId]);

    const handleLike = async () => {
        const { error } = await updateLike(
            currentUser?.email as string,
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
        const data = new FormData(event.currentTarget);
        const comment = data.get('new-comment') as string;

        const { commentId } = await addComment({
            content: comment,
            email: currentUser?.email as string,
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
            <Fade
                in={alert !== ''}
                addEndListener={() =>
                    setTimeout(() => {
                        setAlert('');
                    }, 4000)
                }
            >
                <Alert
                    severity={'error'}
                    sx={{
                        width: '100%',
                        maxWidth: 900,
                        borderRadius: 2,
                        display: alert ? 'flex' : 'none',
                    }}
                >
                    {alert}
                </Alert>
            </Fade>
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
                        spacing={2}
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                    >
                        <Avatar
                            src={post?.profileSrc}
                            alt={post?.username}
                            sx={{ width: 28, height: 28 }}
                        >
                            {post?.username}
                        </Avatar>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 0, md: 3 }}
                            alignItems={'baseline'}
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
                                    sx={{ width: 24, height: 24 }}
                                >
                                    {comment.username}
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
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: 950,
                    p: 2,
                }}
            >
                <Paper
                    component={'form'}
                    onSubmit={handleSubmit}
                    variant="outlined"
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
                        placeholder="댓글을 작성해 주세요."
                        InputProps={{ sx: { borderRadius: 3 } }}
                    />
                    <Stack
                        direction={'column'}
                        spacing={1}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Avatar src={currentUser?.profileSrc}>
                            {currentUser?.username}
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
