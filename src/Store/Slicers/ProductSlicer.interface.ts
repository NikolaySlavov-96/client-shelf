export interface IState {
    id: number;
    stateName: string;
    symbol: string;
}

export interface IProduct {
    productId: number;
    productType: string;
    productStatus: boolean;
    productTitle: string;
    pages: number | null;
    publishedYear: number | null;
    description: string | null;
    statusId?: number | null; // the logged-in user's current shelf status (null when un-shelved / guest)
    ratingAverage?: number;
    ratingCount?: number;
    authorName: string;
    authorImage: string;
    authorGenre: string;
    authorStatus: boolean;
    fileUrl: string;
    fileId: number;
    fileSrc: string;
}

export interface IProductRating {
    average: number;
    count: number;
    userRating: number;
}

export interface IStatusCount {
    statusId: number;
    count: number;
}

export interface IProductWithState extends IProduct {
    productStateId: number;
    productStateStatus: boolean; // IsDelete
    email: string;
    userId: number;
}

export interface IProductEmailType extends IProduct {
    email: string;
    userId: number;
    userYear: number;
    userStatus: boolean;
    stateId: number;
}

export interface IFetchSearchParams {
    page: number;
    limit: number;
    searchContent: string;
    statusId?: number | null;
}

export interface IFetchQueryParams extends IFetchSearchParams {
    type: number;
}

export interface IAddProductWithImage {
    data: {
        author: string;
        productTitle: string;
        genre: string;
    };
    fileDate: {
        file: File;
        name: string;
    };
}
