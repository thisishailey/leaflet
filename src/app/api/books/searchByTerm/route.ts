import { NextRequest, NextResponse } from 'next/server';

const ENDPOINT = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx';

export async function GET(req: NextRequest) {
    const params = new URLSearchParams({
        ttbkey: process.env.NEXT_PUBLIC_ALADIN_API_KEY as string,
        Query: decodeURIComponent(req.headers.get('search') as string),
        output: 'js',
        Version: '20131101',
    });

    const res = await fetch(ENDPOINT, {
        body: params,
        method: 'post',
    });
    const data: BookSearchItemData = await res.json();

    return NextResponse.json(data);
}

export interface BookSearchItemData {
    item: BookItemData[];
    itemsPerPage: number;
    link: string;
    logo: string;
    pubDate: string;
    query: string;
    searchCategoryId: number;
    searchCategoryName: string;
    startIndex: number;
    title: string;
    totalResults: number;
    version: string;
}

export interface BookItemData {
    adult: boolean;
    author: string;
    categoryId: number;
    categoryName: string;
    cover: string;
    customerReviewRank: number;
    description: string;
    fixedPrice: boolean;
    isbn: string;
    isbn13: string;
    itemId: number;
    link: string;
    mallType: string;
    mileage: number;
    priceSales: number;
    priceStandard: number;
    pubDate: string;
    publisher: string;
    salesPoint: number;
    seriesInfo: { seriesId: number; seriesLink: string; seriesName: string };
    stockStatus: string;
    subInfo: Object;
    title: string;
}

export interface BookItem {
    title: string;
    author: string;
    publisher: string;
    pubDate: string;
    categoryName: string;
    description: string;
    cover: string;
    isbn13: string;
}
