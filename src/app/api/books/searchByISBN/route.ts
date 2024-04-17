import { NextRequest, NextResponse } from 'next/server';
import type { BookSearchItemData } from '../type';

const ENDPOINT = 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx';

export async function GET(req: NextRequest) {
    const params = new URLSearchParams({
        ttbkey: process.env.ALADIN_API_KEY as string,
        ItemId: req.headers.get('isbn') as string,
        itemIdType: 'ISBN13',
        Cover: 'Big',
        OptResult: 'ratingInfo,bestSellerRank',
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
