'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPostsByUserId } from '@/firebase/db/query';
import type { PostData } from '@/firebase/db/model';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '@/state/snackbarState';
import { getFormattedDate } from '@/util/datetime';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SkeletonPreviews from './skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Props {
    email: string;
    username: string;
}

export default function MyPosts({ email, username }: Props) {
    const setSnackbar = useSetRecoilState(snackbarState);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadMyPosts = async () => {
            setLoading(true);

            const { result, isEmpty } = await getPostsByUserId(email);

            if (isEmpty) {
                setIsEmpty(true);
                return setLoading(false);
            }

            setPosts(result);
            setLoading(false);
        };

        loadMyPosts();
    }, [email]);

    return (
        <Stack direction={'column'} spacing={2}>
            {loading && <SkeletonPreviews />}
            {isEmpty && (
                <Typography textAlign={'center'}>
                    {'아직 작성한 리프가 없습니다.'}
                </Typography>
            )}
            {posts.map((post) => (
                <Paper key={post._id}>
                    <Stack direction={'column'} spacing={1} p={2} pt={1}>
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                        >
                            <Typography fontWeight={500} fontSize={18}>
                                {username}
                            </Typography>
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </Stack>
                        <Link href={`/post/${post._id}`}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            ></div>
                        </Link>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            pt={1}
                        >
                            <Stack
                                direction={'row'}
                                justifyContent={'space-between'}
                                spacing={2}
                            >
                                <Typography
                                    fontSize={14}
                                    color={'primary'}
                                >{`좋아요 ${post.likes || 0}개`}</Typography>
                                <Typography fontSize={14} color={'primary'}>
                                    {`댓글 ${post.comments?.length || 0}개`}
                                </Typography>
                            </Stack>
                            <Typography fontSize={14} color={'primary'}>
                                {getFormattedDate(post.timestamp!.toDate())}
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}
