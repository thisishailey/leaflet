'use client';

import { useEffect, useState } from 'react';
import { scrollToTop } from '@/util/common';
import SearchPost from '@/components/post/search';
import WritePost from '@/components/post/write';
import ViewPost from '@/components/post/view';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

export default function Home() {
    const [search, setSearch] = useState<string[]>([]);
    const [onSearch, setOnSearch] = useState<boolean>(false);
    const [writePost, setWritePost] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(true);

    useEffect(() => {
        if (search.length === 0) {
            setWritePost(true);
            setOnSearch(false);
        } else {
            setWritePost(false);
            setOnSearch(true);
        }
    }, [search]);

    const handleSearch = (search: string[]) => {
        setSearch(search);
    };

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    return (
        <>
            <Stack
                direction={'column'}
                alignItems={'center'}
                spacing={2.5}
                mb={10}
            >
                <SearchPost handleSearch={handleSearch} />
                {writePost && <WritePost handleRefresh={handleRefresh} />}
                <ViewPost search={search} refresh={refresh} />
            </Stack>
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 30, left: 30 }}
                onClick={() => {
                    if (onSearch && writePost) {
                        setWritePost(false);
                    } else {
                        setWritePost(true);
                        scrollToTop();
                    }
                }}
            >
                {onSearch && writePost ? (
                    <CloseRoundedIcon />
                ) : (
                    <DriveFileRenameOutlineIcon />
                )}
            </Fab>
        </>
    );
}
