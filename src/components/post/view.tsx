'use client';

import { useEffect, useState } from 'react';
import { firestore } from '@/firebase/config';
import { collection as col, getDocs } from 'firebase/firestore';
import {
    COLLECTION_POST,
    COLLECTION_USER,
    PostData,
    UserData,
} from '@/firebase/db/model';
import getData from '@/firebase/db/getData';
import getFile from '@/firebase/storage/getFile';
import { PostPreview } from './post';
import { Paper, Typography } from '@mui/material';

interface Posts {
    data: PostData;
    id: string;
    username: string;
    profileSrc: string;
}

export default function ViewPost() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [noPost, setNoPost] = useState(false);

    useEffect(() => {
        const loadedPosts: Posts[] = [];
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
                const { result, error } = await getData(
                    COLLECTION_USER,
                    postData.email
                );

                if (error) {
                    return;
                }

                const userData = result as UserData;
                const imageUrl = userData.profileImg;

                let profileSrc = '';
                if (imageUrl) {
                    const { result } = await getFile(imageUrl);
                    if (result) {
                        profileSrc = result;
                    }
                }

                const newPost = {
                    data: postData,
                    id: doc.id,
                    username: userData.username,
                    profileSrc: profileSrc,
                };

                loadedPosts.push(newPost);
            }

            setPosts(loadedPosts);
        };
        loadPost();
    }, []);

    return (
        <>
            {posts &&
                posts.map((post) => (
                    <PostPreview
                        username={post.username}
                        content={post.data.content}
                        profileSrc={post.profileSrc}
						id={post.id}
                        key={post.id}
                    />
                ))}
            {noPost && (
                <Paper>
                    <Typography>
                        {
                            '리프가 없습니다. 일시적인 오류일 수 있으니, 페이지를 새로 고침하거나 인터넷에 연결 후 다시 시도해 주세요.'
                        }
                    </Typography>
                </Paper>
            )}
        </>
    );
}
