import { Noto_Sans_KR, Roboto } from 'next/font/google';

export const noto_sans = Noto_Sans_KR({
    weight: ['300', '400', '500', '600'],
    subsets: ['latin'],
});

export const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
});
