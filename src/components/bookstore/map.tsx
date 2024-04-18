'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import type { GeocodeAddress, GeocodeResult } from '@/app/api/bookstore/type';
import Box from '@mui/material/Box';

export default function NaverMap({ address }: { address: string }) {
    const mapRef = useRef<naver.maps.Map | null>(null);

    const initMap = () => {
        const mapOptions: naver.maps.MapOptions = {
            center: new naver.maps.LatLng(37.3595704, 127.105399),
            zoom: 10,
        };
        mapRef.current = new naver.maps.Map('map', mapOptions);
    };

    useEffect(() => {
        const setMarker = async () => {
            const headers = new Headers({ query: encodeURI(address) });
            const res = await fetch('api/bookstore/geocode', { headers });
            const data: GeocodeResult = await res.json();

            if (data.addresses.length === 0) {
                return;
            }
            const result: GeocodeAddress = data.addresses[0];

            const lat = parseFloat(result.y);
            const lng = parseFloat(result.x);
            const latLng = new naver.maps.LatLng(lat, lng);

            const markerOptions: naver.maps.MarkerOptions = {
                position: latLng,
                map: mapRef.current!,
            };
            const marker = new naver.maps.Marker(markerOptions);

            mapRef.current!.setCenter(latLng);
        };

        if (!mapRef.current) {
            setTimeout(() => {
                setMarker();
            }, 100);
        } else {
            setMarker();
        }
    }, [mapRef, address]);

    return (
        <>
            <Script
                onReady={initMap}
                type="text/javascript"
                strategy="afterInteractive"
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLOUD_CLIENT_ID}&submodules=geocoder`}
            />
            <Box id={'map'} width={'100%'} height={'100%'} />
        </>
    );
}
