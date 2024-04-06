import Link from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
    const sms = [
        { name: 'Facebook', icon: <FacebookIcon />, link: '/' },
        { name: 'Instagram', icon: <InstagramIcon />, link: '/' },
        { name: 'Twitter', icon: <XIcon />, link: '/' },
        { name: 'GitHub', icon: <GitHubIcon />, link: '/' },
    ];

    return (
        <Box component={'footer'}>
            <Divider aria-hidden="true" variant="middle" />
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    padding: '40px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1.6rem',
                    }}
                >
                    {sms.map((media) => {
                        return (
                            <Link
                                key={media.name}
                                href={media.link}
                                style={{ height: '24px' }}
                            >
                                {media.icon}
                            </Link>
                        );
                    })}
                </Box>
                <Typography fontSize={'14px'}>
                    {'© 2024 Leaflet. All rights reserved.'}
                </Typography>
            </Container>
        </Box>
    );
}
