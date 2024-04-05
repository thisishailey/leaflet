export default function BookstoreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {'Bookstore'}
            {children}
        </div>
    );
}
