import { Suspense } from 'react';
import type { Metadata } from 'next';
import AuthContextProvider from '@/firebase/auth/state';
import RecoilProvider from '@/state/recoil';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { theme } from '@/styles/theme';
import Wrapper from '@/components/common/wrapper';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import favicon from '@/assets/favicon/favicon.ico';
import Box from '@mui/material/Box';

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
                    <head>
                        <link
                            rel="icon"
                            href={favicon.src}
                            type="image/x-icon"
                        />
                    </head>
                    <body>
                        <RecoilProvider>
                            <AuthContextProvider>
                                <Header />
                                <Wrapper>
                                    <Suspense
                                        fallback={<Box>{'Loading...'}</Box>}
                                    >
                                        {children}
                                    </Suspense>
                                </Wrapper>
                                <Footer />
                            </AuthContextProvider>
                        </RecoilProvider>
                    </body>
                </html>
            </CssVarsProvider>
        </AppRouterCacheProvider>
    );
}
