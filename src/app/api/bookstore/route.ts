import { NextRequest, NextResponse } from 'next/server';
import { RegionSearchResult } from './type';

const ENDPOINT = 'https://openapi.naver.com/v1/search/local.json';

export async function GET(req: NextRequest) {
    const query = req.headers.get('query');
    const headers = new Headers({
        'X-Naver-Client-Id': process.env.NEXT_PUBLIC_NAVER_CLIENT_ID as string,
        'X-Naver-Client-Secret': process.env
            .NEXT_PUBLIC_NAVER_CLIENT_SECRET as string,
    });

    const res = await fetch(`${ENDPOINT}?query=${query}&display=5`, {
        headers,
        cache: 'force-cache',
    });
    const data: RegionSearchResult = await res.json();

    return NextResponse.json(data);
}
