/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.aladin.co.kr',
                port: '',
                pathname: '/product/**',
            },
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
