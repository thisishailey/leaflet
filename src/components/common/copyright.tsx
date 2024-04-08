import Link from 'next/link';
import Typography from '@mui/material/Typography';

export const CopyrightShort = (props: any) => {
    return (
        <Typography variant="body2" align="center" {...props}>
            {'Copyright © '}
            <Link href="/">{'Leaflet '}</Link>
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

export const Copyright = (props: any) => {
    return (
        <Typography {...props}>
            {'© '}
            {new Date().getFullYear()}
            <Link href="/">{' Leaflet'}</Link>
            {'. All rights reserved.'}
        </Typography>
    );
};
