import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface PreviewProps {
    id: string;
    username: string;
    content: string;
    profileSrc: string;
}

export function PostPreview({
    id,
    username,
    content,
    profileSrc,
}: PreviewProps) {
    return (
        <Link
            href={`/post/${id}`}
            style={{
                width: '100%',
                maxWidth: 900,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 900,
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
                variant="outlined"
            >
                <CardHeader
                    avatar={
                        <Avatar src={profileSrc} alt={username}>
                            {!profileSrc && username}
                        </Avatar>
                    }
                    action={
                        <IconButton>
                            <MoreHorizIcon />
                        </IconButton>
                    }
                    title={username}
                />
                <CardContent sx={{ pt: 0 }}>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </CardContent>
            </Card>
        </Link>
    );
}
