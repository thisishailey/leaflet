'use client';

import { useEffect, useState } from 'react';
import { type Post, getPosts } from '@/firebase/db/query';
import { useRecoilState } from 'recoil';
import { postState } from '@/state/postState';

import { PostPreview } from './post';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface Props {
    search: string[];
    refresh: boolean;
}

export default function ViewPost({ search, refresh }: Props) {
    const [postsAll, setPostsAll] = useRecoilState(postState);
    const [posts, setPosts] = useState<Post[]>([]);
    const [noPost, setNoPost] = useState<boolean>(false);
    const [noSearchResult, setNoSearchResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const noPostText = '리프가 없습니다.';
    const noSearchResultText = '검색 결과가 없습니다.';

    useEffect(() => {
        setLoading(true);

        if (postsAll === null) {
            setNoPost(true);
        } else if (postsAll.length > 0) {
            setPosts(postsAll);
        } else {
            (async () => {
                const posts = await getPosts();

                if (posts.isEmpty) {
                    setPostsAll(null);
                    setNoPost(true);
                } else {
                    setPostsAll(posts.result);
                    setPosts(posts.result);
                }
            })();
        }

        setLoading(false);
    }, [postsAll, refresh, setPostsAll]);

    useEffect(() => {
        if (postsAll === null || postsAll.length === 0) {
            return;
        }

        if (search.length === 0) {
            return setPosts(postsAll);
        }

        const handleSearch = () => {
            setLoading(true);

            const filteredPosts: Post[] = [];

            for (let i = 0; i < postsAll.length; i++) {
                const content = postsAll[i].data.content;
                let match = 0;

                for (const item of search) {
                    if (content.includes(item)) {
                        match++;
                    }
                }

                if (match > 0) {
                    filteredPosts.push({ ...postsAll[i], match });
                }
            }

            filteredPosts.sort((a, b) => b.match! - a.match!);
            setPosts(filteredPosts);

            if (filteredPosts.length === 0) {
                setNoSearchResult(true);
            } else {
                setNoSearchResult(false);
            }

            setLoading(false);
        };

        handleSearch();
    }, [postsAll, search]);

    return (
        <Stack direction={'column'} spacing={1} width={'100%'}>
            {loading && <SkeletonPostPreviews />}
            {posts.map((post) => (
                <PostPreview
                    key={post.id}
                    id={post.id}
                    username={post.writer.username}
                    profileSrc={post.writer.profileSrc}
                    content={post.data.content}
                />
            ))}
            {noPost && <Typography>{noPostText}</Typography>}
            {noSearchResult && <Typography>{noSearchResultText}</Typography>}
        </Stack>
    );
}

function SkeletonPostPreviews() {
    return (
        <>
            <Skeleton variant="rectangular" width={'100%'} height={114} />
            <Skeleton variant="rectangular" width={'100%'} height={114} />
            <Skeleton variant="rectangular" width={'100%'} height={114} />
            <Skeleton variant="rectangular" width={'100%'} height={114} />
            <Skeleton variant="rectangular" width={'100%'} height={114} />
            <Skeleton variant="rectangular" width={'100%'} height={114} />
        </>
    );
}
