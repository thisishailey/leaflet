'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type PostPreview, getPostPreview } from '@/firebase/db/getData';
import { updateLike } from '@/firebase/db/updateData';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '@/state/snackbarState';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    email: string;
    likedPosts: string[];
}

export default function LikedPosts({ email, likedPosts }: Props) {
    const setSnackbar = useSetRecoilState(snackbarState);
    const [posts, setPosts] = useState<PostPreview[]>([]);

    useEffect(() => {
        if (likedPosts.length === 0) {
            return;
        }

        const loadLikedPosts = async () => {
            const posts: PostPreview[] = [];

            for (let i = 0; i < likedPosts.length; i++) {
                const result = await getPostPreview(likedPosts[i]);

                if (result.data) {
                    posts.push(result.data);
                }
            }

            setPosts(posts);
        };

        loadLikedPosts();
    }, [likedPosts]);

    const handleRemove = async (postId: string) => {
        const result = await updateLike(email, postId, true);

        if (result.error) {
            setSnackbar('오류가 발생했습니다. 다시 시도해 주세요.');
        } else {
            setSnackbar('좋아요가 취소되었습니다.');
        }

        setPosts((prev) => prev.filter((post) => post._id !== postId));
    };

    return (
        <Stack direction={'column'} spacing={2}>
            {posts.map((post) => (
                <Paper key={post._id}>
                    <Stack direction={'column'} spacing={1} p={2} pt={1}>
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                        >
                            <Typography fontWeight={500} fontSize={18}>
                                {post.username}
                            </Typography>
                            <IconButton onClick={() => handleRemove(post._id!)}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <Link href={`/post/${post._id}`}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            ></div>
                            <Stack
                                direction={'row'}
                                justifyContent={'space-between'}
                                pt={1}
                            >
                                <Typography
                                    fontSize={14}
                                    color={'primary'}
                                >{`좋아요 ${post.likes}개`}</Typography>
                                <Typography fontSize={14} color={'primary'}>
                                    {post.date}
                                </Typography>
                            </Stack>
                        </Link>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}
