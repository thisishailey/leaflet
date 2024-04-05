import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/icon/icon.png';

export default function Header() {
    return (
        <AppBar color="default" position="fixed">
            <Toolbar
                sx={{
                    width: '100%',
                    maxWidth: '1024px',
                    margin: '0 auto',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                }}
            >
                <Link href={'/'} style={{ height: '50px' }}>
                    <Image
                        src={logo.src}
                        alt="Leaflet"
                        width={'50'}
                        height={'50'}
                        priority
                    />
                </Link>
            </Toolbar>
        </AppBar>
    );
}
