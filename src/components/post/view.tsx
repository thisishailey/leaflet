'use client';

import { useEffect, useState } from 'react';
import { firestore } from '@/firebase/config';
import { collection as col, getDocs } from 'firebase/firestore';
import { type UserBasic, getUserProfile } from '@/firebase/db/getData';
import { type PostData, COLLECTION_POST } from '@/firebase/db/model';
import { PostPreview } from './post';
import Typography from '@mui/material/Typography';

interface Post {
    id: string;
    data: PostData;
    writer: UserBasic;
    match?: number;
}

export default function ViewPost({ search }: { search: string[] }) {
    const [postsAll, setPostsAll] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [noPost, setNoPost] = useState(false);
    const [noSearchResult, setNoSearchResult] = useState(false);
    const noPostText = '리프가 없습니다.';
    const noSearchResultText = '검색 결과가 없습니다.';

    useEffect(() => {
        const loadedPosts: Post[] = [];

        const loadPost = async () => {
            const querySnapshot = await getDocs(
                col(firestore, COLLECTION_POST)
            );

            if (querySnapshot.empty) {
                return setNoPost(true);
            }

            setNoPost(false);

            for (const doc of querySnapshot.docs) {
                const postData = doc.data() as PostData;
                const { user, error } = await getUserProfile(postData.email);

                if (error) {
                    return;
                }

                const newPost = {
                    id: doc.id,
                    data: postData,
                    writer: user as UserBasic,
                };

                loadedPosts.push(newPost);
            }

            setPostsAll(loadedPosts);
        };

        loadPost();
    }, []);

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
        <>
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
        </>
    );
}
