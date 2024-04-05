export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {'Profile'}
            {children}
        </div>
    );
}
