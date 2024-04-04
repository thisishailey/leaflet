import type { Metadata } from 'next';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/styles/theme';

export const metadata: Metadata = {
    title: 'Leaflet',
    description: 'A social media platform for book lovers',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider theme={theme}>
            <html lang="en">
                <CssBaseline enableColorScheme />
                <body>{children}</body>
            </html>
        </ThemeProvider>
    );
}
