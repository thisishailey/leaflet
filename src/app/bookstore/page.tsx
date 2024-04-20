'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RegionSearchItem, RegionSearchResult } from '../api/bookstore/type';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CustomAlert from '@/components/common/alert';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import NaverMap from '@/components/bookstore/map';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MapIcon from '@mui/icons-material/Map';

type BookPlaceTypes = '도서관' | '서점' | '북카페';
const places: BookPlaceTypes[] = ['도서관', '서점', '북카페'];

export default function Bookstore() {
    const [alert, setAlert] = useState<string>('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [place, setPlace] = useState<BookPlaceTypes>('도서관');
    const [bookPlaces, setBookPlaces] = useState<RegionSearchItem[]>();
    const [marker, setMarker] = useState<string>('');

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const region = formData.get('region') as string;

        const query = encodeURI(`${region} ${place}`);
        const headers = new Headers({ query });
        const res = await fetch('/api/bookstore', { headers });
        const data: RegionSearchResult = await res.json();

        if (data.total < 1) {
            return setAlert(`검색어 ${region}에 해당하는 ${place}가 없습니다.`);
        }

        setBookPlaces(data.items);
        console.log(data.items);
    };

    return (
        <>
            <CustomAlert alert={alert} setAlert={setAlert} />
            <Stack direction={'column'} spacing={2}>
                <Modal
                    open={openModal}
                    onClose={() => {
                        setOpenModal(false);
                        setMarker('');
                    }}
                >
                    <Box
                        position={'relative'}
                        top={'50%'}
                        left={'50%'}
                        sx={{ transform: 'translate(-50%, -50%)' }}
                        width={{ xs: '90%', sm: '70%', md: '60%', lg: '50%' }}
                        height={{ xs: '60%', md: '50%' }}
                    >
                        <NaverMap address={marker} />
                    </Box>
                </Modal>
                <ToggleButtonGroup
                    exclusive
                    value={place}
                    onChange={(event, value) => setPlace(value)}
                    color="primary"
                    sx={{ width: 300, alignSelf: 'center' }}
                >
                    {places.map((place) => (
                        <ToggleButton key={place} value={place} fullWidth>
                            {place}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <Stack
                    direction={'row'}
                    spacing={2}
                    component={'form'}
                    onSubmit={handleSearch}
                >
                    <TextField
                        required
                        fullWidth
                        autoComplete="off"
                        name="region"
                        placeholder="키워드나 지역 이름을 입력해 주세요."
                    />
                    <Button type="submit" variant="contained">
                        {'검색'}
                    </Button>
                </Stack>
                <Stack direction={'column'} spacing={2} pt={2}>
                    {bookPlaces &&
                        bookPlaces.map((place) => (
                            <Paper
                                key={place.address}
                                elevation={4}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    p: 3,
                                }}
                            >
                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    spacing={1}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: place.title,
                                        }}
                                        style={{ fontSize: '18px' }}
                                    ></div>
                                    <Tooltip
                                        title="지도 보기"
                                        placement="right"
                                    >
                                        <IconButton
                                            onClick={() => {
                                                setMarker(place.address);
                                                setOpenModal(true);
                                            }}
                                        >
                                            <MapIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    spacing={{ xs: 0.5, md: 2 }}
                                    divider={
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                        />
                                    }
                                >
                                    <Typography fontSize={14}>
                                        {place.roadAddress}
                                    </Typography>
                                    <Typography fontSize={14}>
                                        {place.category}
                                    </Typography>
                                    {place.link && (
                                        <Link href={place.link}>
                                            <Typography
                                                fontSize={14}
                                                color={'primary.main'}
                                            >
                                                {'홈페이지'}
                                            </Typography>
                                        </Link>
                                    )}
                                </Stack>
                            </Paper>
                        ))}
                </Stack>
            </Stack>
        </>
    );
}
