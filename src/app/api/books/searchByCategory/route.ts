import { NextRequest, NextResponse } from 'next/server';
import { BookSearchItemData } from '../type';

const ENDPOINT = 'http://www.aladin.co.kr/ttb/api/ItemList.aspx';

export type SearchCategory =
    | 'ItemNewSpecial'
    | 'ItemNewAll'
    | 'Bestseller'
    | 'BlogBest';

export async function GET(req: NextRequest) {
    const params = new URLSearchParams({
        ttbkey: process.env.ALADIN_API_KEY as string,
        QueryType: req.headers.get('category') as SearchCategory,
        SearchTarget: 'Book',
        Cover: 'Big',
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
