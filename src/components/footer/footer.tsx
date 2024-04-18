import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Copyright } from '../common/copyright';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

export default function Footer() {
    const sms = [
        {
            name: 'Facebook',
            icon: <FacebookIcon />,
            link: 'https://www.facebook.com/',
        },
        {
            name: 'Instagram',
            icon: <InstagramIcon />,
            link: 'https://www.instagram.com/',
        },
        { name: 'Twitter', icon: <XIcon />, link: 'https://twitter.com/' },
        {
            name: 'GitHub',
            icon: <GitHubIcon />,
            link: 'https://github.com/kfbkhw/leaflet',
        },
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
                <Stack direction="row" spacing={2}>
                    {sms.map((media) => {
                        return (
                            <Link
                                key={media.name}
                                href={media.link}
                                style={{ height: 24 }}
                            >
                                {media.icon}
                            </Link>
                        );
                    })}
                </Stack>
                <Copyright fontSize={'14px'} />
            </Container>
        </Box>
    );
}
