export interface BookSearchItemData {
    item: BookItemData[];
    itemsPerPage: number;
    link: string;
    logo: string;
    pubDate: string;
    query: string;
    searchCategoryId: number;
    searchCategoryName: string;
    startIndex: number;
    title: string;
    totalResults: number;
    version: string;
}

export interface BookItemData {
    adult: boolean;
    author: string;
    categoryId: number;
    categoryName: string;
    cover: string;
    customerReviewRank: number;
    description: string;
    fixedPrice: boolean;
    isbn: string;
    isbn13: string;
    itemId: number;
    link: string;
    mallType: string;
    mileage: number;
    priceSales: number;
    priceStandard: number;
    pubDate: string;
    publisher: string;
    salesPoint: number;
    seriesInfo: { seriesId: number; seriesLink: string; seriesName: string };
    stockStatus: string;
    subInfo: Object;
    title: string;
}

export interface BookItem {
    title: string;
    author: string;
    publisher: string;
    pubDate: string;
    categoryName: string;
    description: string;
    cover: string;
    isbn13: string;
}
