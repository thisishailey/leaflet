import Link from 'next/link';
import type { BookItem } from '@/app/api/books/type';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export function BookCard({
    book,
    tabIndex,
}: {
    book: BookItem;
    tabIndex: number;
}) {
    return (
        <Link
            href={`/book/${book.isbn13}`}
            style={{
                width: 170,
                height: '100%',
                maxHeight: 300,
            }}
            tabIndex={tabIndex}
        >
            <Card
                sx={{
                    width: 170,
                    height: '100%',
                    maxHeight: 300,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                }}
                elevation={0}
            >
                <CardMedia
                    image={book.cover}
                    title={book.title}
                    sx={{ width: 120, height: 150, backgroundSize: 'contain' }}
                />
                <CardContent sx={{ p: '0 !important' }}>
                    <Typography
                        width={150}
                        fontSize={14}
                        fontWeight={500}
                        sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            mb: 1,
                        }}
                    >
                        {book.title}
                    </Typography>
                    <Typography noWrap width={150} fontSize={12}>
                        {book.author}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}
