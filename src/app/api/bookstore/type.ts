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
