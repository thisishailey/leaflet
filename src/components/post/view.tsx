'use client';

import { cache, useEffect, useState } from 'react';
import { type Post, getPosts } from '@/firebase/db/query';
import { PostPreview } from './post';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface Props {
    search: string[];
    refresh: boolean;
}

export default function ViewPost({ search, refresh }: Props) {
    const [postsAll, setPostsAll] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [noPost, setNoPost] = useState(false);
    const [noSearchResult, setNoSearchResult] = useState(false);

    const noPostText = '리프가 없습니다.';
    const noSearchResultText = '검색 결과가 없습니다.';

    useEffect(() => {
        const loadPost = cache(async () => {
            const posts = await getPosts();

            if (posts.isEmpty) {
                return setNoPost(true);
            }

            setPostsAll(posts.result);
        });

        loadPost();
    }, [refresh]);

    useEffect(() => {
        const handleSearch = () => {
            if (search.length === 0) {
                return setPosts(postsAll);
            }

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
        };

        handleSearch();
    }, [postsAll, search]);

    return (
        <Stack direction={'column'} spacing={1} width={'100%'}>
            {posts &&
                posts.map((post) => (
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
