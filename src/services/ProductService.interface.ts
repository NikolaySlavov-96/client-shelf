export interface IAuthor {
    id: number;
    name: string;
}

interface IProduct {
    productId: number;
    productType: string;
    productStatus: boolean;
    productTitle: string;
    pages: number | null;
    publishedYear: number | null;
    description: string | null;
    ratingAverage?: number;
    ratingCount?: number;
    authors: IAuthor[];
    authorsSeparator: string;
    fileUrl: string;
    fileId: number;
    fileSrc: string;
}

export interface IGetProductRatingResponse {
    average: number;
    count: number;
    userRating: number;
}

export interface IRateProductResponse {
    average: number;
    count: number;
    userRating: number;
}

export type IGetStatesRequest = Record<string, never>;

export interface IGetStatesResponse {
    id: number;
    stateName: string;
    symbol: '📖';
}

export type IGetProductRequest = Record<string, never>;

export type IGetProductResponse = IProduct;

export interface IGetProductsRequest {
    limit: number;
    page: number;
    searchContent: string;
    statusId?: number | null;
}

export interface IGetProductsResponse {
    count: number;
    rows: IProduct[];
}

export interface ICreateProductRequest {
    authors: string[];
    authorsSeparator?: string;
    productTitle: string;
    genre: string;
    filesId?: number[];
}

export interface ICreateProductResponse {
    productId: number;
}

export type IEditProductRequest = Record<string, never>;

export type IEditProductResponse = Record<string, never>;

export interface ISearchProductByEmailRequest {
    searchContent: string;
    page: number;
    limit: number;
}

interface IProductEmailType extends IProduct {
    email: string;
    userId: number;
    userYear: number;
    userStatus: boolean;
    bookImage: string;
    stateId: number;
}

export interface ISearchProductByEmailResponse {
    count: number;
    rows: IProductEmailType[];
}

export interface IGetAllProductByStateRequest extends IGetProductsRequest {
    type: number;
}

interface IProductWithState extends IProduct {
    productStateId: number;
    productStateStatus: boolean; // IsDelete
    // TODO Check name
    bookImage: string;
    email: string;
    userId: number;
}
export interface IGetAllProductByStateResponse {
    count: number;
    rows: IProductWithState[];
}

export interface IGetStatusResponse {
    statusId: number;
}

export interface IStatusCount {
    statusId: number;
    count: number;
}

export type IGetStatusCountsResponse = IStatusCount[];

export interface IAddingProductInLibraryRequest {
    statusId: string;
    productId: string;
}

export interface IAddingProductInLibraryResponse {
    userInfo: Record<string, unknown>;
    message: string;
    messageCode: string;
}
