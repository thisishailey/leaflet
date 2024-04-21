import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PostPreview, getPostPreview } from '@/firebase/db/getData';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Props {
    userData: {
        email: string;
        like: string[] | undefined;
        bookmark: string[] | undefined;
    };
}

export default function UserTabs({ userData }: Props) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const [tab, setTab] = useState('1');

    const handleSwitchTab = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    return (
        <Box width={'100%'}>
            <TabContext value={tab}>
                <Box borderBottom={1} borderColor={'divider'}>
                    <TabList onChange={handleSwitchTab}>
                        <Tab
                            label="내 리프"
                            value="1"
                            sx={{
                                flexGrow: 1,
                                color: 'GrayText',
                                minWidth: 40,
                            }}
                        />
                        <Tab
                            label="내 리뷰"
                            value="2"
                            sx={{
                                flexGrow: 1,
                                color: 'GrayText',
                                minWidth: 40,
                            }}
                        />
                        <Tab
                            icon={matches ? <FavoriteIcon /> : undefined}
                            label={!matches && '내가 좋아한 리프'}
                            value="3"
                            sx={{
                                flexGrow: 1,
                                color: 'GrayText',
                                minWidth: 40,
                            }}
                        />
                        <Tab
                            icon={matches ? <BookmarkIcon /> : undefined}
                            label={!matches && '내가 저장한 리프'}
                            value="4"
                            sx={{
                                flexGrow: 1,
                                color: 'GrayText',
                                minWidth: 40,
                            }}
                        />
                    </TabList>
                </Box>
                <TabPanel value="1">{'내 리프'}</TabPanel>
                <TabPanel value="2">{'내 리뷰'}</TabPanel>
                <TabPanel value="3">
                    {userData.like ? (
                        <LikedPosts likedPosts={userData.like} />
                    ) : (
                        <Typography>
                            {'아직 좋아요를 누른 리프가 없습니다.'}
                        </Typography>
                    )}
                </TabPanel>
                <TabPanel value="4">{'내가 저장한 리프'}</TabPanel>
            </TabContext>
        </Box>
    );
}

function LikedPosts({ likedPosts }: { likedPosts: string[] }) {
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

    return (
        <Stack direction={'column'}>
            {posts.map((post) => (
                <Paper key={post._id}></Paper>
            ))}
        </Stack>
    );
}