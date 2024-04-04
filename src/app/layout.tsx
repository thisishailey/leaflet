import type { Metadata } from 'next';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
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
        <AppRouterCacheProvider>
            <CssVarsProvider theme={theme}>
                <CssBaseline />
                <html lang="en">
                    <body>{children}</body>
                </html>
            </CssVarsProvider>
        </AppRouterCacheProvider>
    );
}
