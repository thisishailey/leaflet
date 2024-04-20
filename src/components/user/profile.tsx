'use client';

import AuthButtons from '@/firebase/auth/components/authButtons';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';

interface Props {
    username: string;
    profileSrc?: string;
    followerCount: number;
    followingCount: number;
    bio?: string;
}

export default function UserProfile(props: Props) {
    return (
        <Stack
            direction={'row'}
            spacing={{ xs: 2, sm: 4, md: 8 }}
            mt={{ xs: 1, md: 2 }}
            mb={4}
            px={{ xs: 0, sm: 2, md: 6, lg: 8 }}
        >
            <Stack
                direction={'column'}
                alignItems={'center'}
                spacing={1.5}
                pt={1}
            >
                <Avatar
                    src={props.profileSrc}
                    alt={props.username}
                    sx={{
                        width: { xs: 54, sm: 72 },
                        height: { xs: 54, sm: 72 },
                    }}
                >
                    {props.username}
                </Avatar>
                <AuthButtons />
            </Stack>
            <Stack direction={'column'} spacing={1.5}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    width={220}
                >
                    <Typography
                        component={'h2'}
                        fontWeight={500}
                        fontSize={{ xs: 20, sm: 24 }}
                    >
                        {props.username}
                    </Typography>
                    <IconButton size="small">
                        <EditIcon />
                    </IconButton>
                </Stack>
                <ButtonGroup fullWidth sx={{ width: 220 }}>
                    <Button>{`팔로워 ${props.followerCount}명`}</Button>
                    <Button>{`팔로잉 ${props.followingCount}명`}</Button>
                </ButtonGroup>
                <Typography>
                    {props.bio || '바이오를 작성해 주세요.'}
                </Typography>
            </Stack>
        </Stack>
    );
}
