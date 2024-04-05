export default function PostLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {'Post'}
            {children}
        </div>
    );
}
