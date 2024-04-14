import { NextRequest, NextResponse } from 'next/server';

const ENDPOINT = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx';

export async function GET(req: NextRequest) {
    const params = new URLSearchParams({
        ttbkey: process.env.NEXT_PUBLIC_ALADIN_API_KEY as string,
        Query: req.headers.get('search') as string,
        output: 'js',
        Version: '20131101',
    });

    const res = await fetch(ENDPOINT, {
        body: params,
        method: 'post',
    });
    const data = await res.json();

    return NextResponse.json({ data });
}
