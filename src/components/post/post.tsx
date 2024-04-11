import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface PreviewProps {
    username: string;
    content: string;
}

export function PostPreview({ username, content }: PreviewProps) {
    return (
        <Card
            sx={{ width: '100%', maxWidth: 900, borderRadius: 4 }}
            variant="outlined"
        >
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            bgcolor: 'primary.light',
                            color: 'secondary.main',
                        }}
                    />
                }
                action={
                    <IconButton>
                        <MoreHorizIcon />
                    </IconButton>
                }
                title={username}
            />
            <CardContent sx={{ pt: 0 }}>{content}</CardContent>
        </Card>
    );
}
