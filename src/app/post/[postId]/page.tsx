'use client';

import { useEffect, useState } from 'react';
import getData from '@/firebase/db/getData';
import getFile from '@/firebase/storage/getFile';
import {
    COLLECTION_POST,
    COLLECTION_USER,
    PostData,
    UserData,
} from '@/firebase/db/model';
import type { Timestamp } from 'firebase/firestore';
import { getElapsedTime } from '@/util/datetime';
import { emptyValue } from '@/util/util';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';

export default function Post({ params }: { params: { postId: string } }) {
    const [loadFailed, setLoadFailed] = useState(false);
    const [alert, setAlert] = useState<string>('');

    const [username, setUsername] = useState<string>('');
    const [profileSrc, setProfileSrc] = useState<string>('');
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const [elapsedTime, setElapsedTime] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [comments, setComments] = useState<string[]>([]);
    const [likes, setLikes] = useState<number>(0);

    const [currentUserName, setCurrentUserName] = useState<string>('');
    const [currentUserProfile, setCurrentUserProfile] = useState<string>('');

    useEffect(() => {
        const loadPost = async () => {
            const { result, error } = await getData(
                COLLECTION_POST,
                params.postId
            );

            if (error) {
                setLoadFailed(true);
            }
            setLoadFailed(false);

            const postData = result as PostData;

            const content = postData.content;
            setContent(content);
            const timestamp = postData.timestamp as Timestamp;
            const elapsedTime = getElapsedTime(timestamp.toDate());
            setElapsedTime(elapsedTime);
            const likes = postData.likes || 0;
            setLikes(likes);
            const comments = postData.comments || [];
            setComments(comments);

            let imageUrl: string;
            const getUsername = async () => {
                const { result, error } = await getData(
                    COLLECTION_USER,
                    postData.email
                );

                if (error) {
                    return setAlert('아이디를 불러오지 못했습니다.');
                }

                const userData = result as UserData;
                setUsername(userData.username);
                imageUrl = userData.profileImg as string;
            };
            await getUsername();

            const getProfileImage = async () => {
                const { result } = await getFile(imageUrl);
                if (result) {
                    setProfileSrc(result);
                }
            };
            await getProfileImage();

            const images = postData.images;
            if (images) {
                const imageUrl: string[] = [];

                for (const image of images) {
                    const { result, error } = await getFile(image);
                    if (error) {
                        continue;
                    }
                    imageUrl.push(result as string);
                }

                setImages(imageUrl);
            }
        };

        loadPost();
    }, [params.postId]);

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const comment = data.get('new-comment');

        emptyValue('#new-comment');
    };

    return (
        <>
            <style>{`footer {display: none;} #bottom-action-buttons {display: none;}`}</style>
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
                            src={profileSrc}
                            alt={username}
                            sx={{ width: 28, height: 28 }}
                        >
                            {username}
                        </Avatar>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 0, md: 3 }}
                            alignItems={'baseline'}
                        >
                            <Typography fontSize={18} fontWeight={600}>
                                {username}
                            </Typography>
                            <Typography fontSize={14} color={'primary.main'}>
                                {elapsedTime}
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
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </Box>
                <Grid container gap={2} m={1}>
                    {images.map((image) => (
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
                    divider={
                        <Divider
                            orientation="vertical"
                            aria-hidden="true"
                            flexItem
                        />
                    }
                >
                    <Typography>{`댓글 ${comments.length}개`}</Typography>
                    <Typography>{`좋아요 ${likes}개`}</Typography>
                </Stack>
            </Paper>
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
                        <Avatar src={currentUserProfile}>
                            {currentUserName}
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
