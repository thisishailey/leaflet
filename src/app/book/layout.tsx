export default function BookLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {'Book'}
            {children}
        </div>
    );
}
