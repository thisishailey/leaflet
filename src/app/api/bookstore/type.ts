export interface RegionSearchResult {
    display: number;
    items: RegionSearchItem[];
    lastBuildDate: string;
    start: number;
    total: number;
}

export interface RegionSearchItem {
    address: string;
    category: string;
    description: string;
    link: string;
    mapx: string;
    mapy: string;
    roadAddress: string;
    telephone: string;
    title: string;
}

export interface GeocodeResult {
    addresses: GeocodeAddress[];
    errorMessage: string;
    meta: { totalCount: number; page: number; count: number };
    status: string;
}

export interface GeocodeAddress {
    addressElements: Object[];
    distance: number;
    englishAddress: string;
    jibunAddress: string;
    roadAddress: string;
    x: string;
    y: string;
}
