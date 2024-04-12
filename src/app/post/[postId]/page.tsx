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
import Paper from '@mui/material/Paper';
import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export default function Post({ params }: { params: { postId: string } }) {
    const [loadFailed, setLoadFailed] = useState(false);
    const [alert, setAlert] = useState<string>('');
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [profileSrc, setProfileSrc] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [elapsedTime, setElapsedTime] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);

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

    return (
        <Paper
            variant="outlined"
            sx={{ minHeight: 200, p: 2, borderRadius: 4 }}
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
                        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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
            <Divider aria-hidden="true" sx={{ py: 1 }} />
            <Box p={3}>
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
    );
}
