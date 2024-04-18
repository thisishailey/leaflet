import { NextRequest, NextResponse } from 'next/server';
import { GeocodeResult } from '../type';

const ENDPOINT = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode';

export async function GET(req: NextRequest) {
    const query = req.headers.get('query');
    const headers = new Headers({
        'X-NCP-APIGW-API-KEY-ID': process.env
            .NEXT_PUBLIC_NAVER_CLOUD_CLIENT_ID as string,
        'X-NCP-APIGW-API-KEY': process.env
            .NEXT_PUBLIC_NAVER_CLOUD_CLIENT_SECRET as string,
    });

    const res = await fetch(`${ENDPOINT}?query=${query}`, {
        headers,
    });
    const data: GeocodeResult = await res.json();

    return NextResponse.json(data);
}
