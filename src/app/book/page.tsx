'use client';

import { useEffect } from 'react';

export default function Book() {
    useEffect(() => {
        const loadBestseller = async () => {
            const header = new Headers({ category: 'Bestseller' });
            const res = await fetch('/api/books/searchByCategory', {
                headers: header,
            });
            const data = res.json();
            console.log(data);
        };

        loadBestseller();
    }, []);
    return <div>{'Book Page'}</div>;
}
