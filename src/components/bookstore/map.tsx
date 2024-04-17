import Script from 'next/script';
import Box from '@mui/material/Box';

export default function NaverMap() {
    const initMap = () => {
        const mapOptions = {
            center: new naver.maps.LatLng(37.3595704, 127.105399),
            zoom: 10,
        };
        const map = new naver.maps.Map('map', mapOptions);
    };

    return (
        <>
            <Script
                onReady={initMap}
                type="text/javascript"
                strategy="afterInteractive"
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLOUD_CLIENT_ID}`}
            />
            <Box id={'map'} width={'100%'} height={'100%'} />
        </>
    );
}
