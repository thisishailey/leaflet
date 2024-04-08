import Link from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import { Copyright } from '../common/copyright';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';

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
                <Copyright fontSize={'14px'} />
            </Container>
        </Box>
    );
}
