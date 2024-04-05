export default function UserLayout({
    children,
    post,
    review,
    wishlist,
}: Readonly<{
    children: React.ReactNode;
    post: React.ReactNode;
    review: React.ReactNode;
    wishlist: React.ReactNode;
}>) {
    const currentTab: string = 'post';

    return (
        <div>
            {'User'}
            {children}
            {currentTab === 'post' && post}
            {currentTab === 'review' && review}
            {currentTab === 'wishlist' && wishlist}
        </div>
    );
}
