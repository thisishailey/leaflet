import { NextRequest, NextResponse } from 'next/server';
import type { BookSearchItemData } from '../type';

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
        cache: 'force-cache',
    });
    const data: BookSearchItemData = await res.json();

    return NextResponse.json(data);
}
