export default function ProfileLayout({
    children,
    post,
    review,
    wishlist,
    bookmark,
}: Readonly<{
    children: React.ReactNode;
    post: React.ReactNode;
    review: React.ReactNode;
    wishlist: React.ReactNode;
    bookmark: React.ReactNode;
}>) {
    const currentTab: string = 'none';

    return (
        <div>
            {'Profile'}
            {children}
            {currentTab === 'post' && post}
            {currentTab === 'review' && review}
            {currentTab === 'wishlist' && wishlist}
            {currentTab === 'bookmark' && bookmark}
        </div>
    );
}
