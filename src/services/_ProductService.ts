import api from './_api';
import {
    type IAddingProductInLibraryRequest,
    type IAddingProductInLibraryResponse,
    type ICreateProductRequest,
    type ICreateProductResponse,
    type IEditProductRequest,
    type IEditProductResponse,
    type IGetAllProductByStateRequest,
    type IGetAllProductByStateResponse,
    type IGetProductRatingResponse,
    type IGetProductResponse,
    type IGetProductsRequest,
    type IGetProductsResponse,
    type IGetStatesResponse,
    type IGetStatusCountsResponse,
    type IGetStatusResponse,
    type IRateProductResponse,
    type ISearchProductByEmailRequest,
    type ISearchProductByEmailResponse,
} from './ProductService.interface';

const PREFIX = '/product';
const SEARCH = '/search';

// Get product States ( id, title, symbol ) / For Reading, Reading and e.t.n.
export const getAllStatus = (): Promise<IGetStatesResponse[]> => api.get(`${PREFIX}/status/all`);

// Product Services
export const getProducts = (data: IGetProductsRequest): Promise<IGetProductsResponse> => {
    const statusQuery = data?.statusId ? `&status=${data.statusId}` : '';
    const search = encodeURIComponent(data?.searchContent ?? '');
    return api.get(`${PREFIX}?limit=${data?.limit}&page=${data?.page}&search=${search}${statusQuery}`);
};

export const getProduct = (id: string): Promise<IGetProductResponse> => api.get(`${PREFIX}/` + id);

export const createProduct = (data: ICreateProductRequest): Promise<ICreateProductResponse> =>
    api.post(`${PREFIX}`, { inputData: data });

export const editProduct = (id: string, data: IEditProductRequest): Promise<IEditProductResponse> =>
    api.put(`${PREFIX}/` + id, { inputData: data });

export const deleteProduct = (id: string) => api.remove(`${PREFIX}/` + id);

export const searchProductByEmailOnUser = ({
    searchContent,
    page,
    limit,
}: ISearchProductByEmailRequest): Promise<ISearchProductByEmailResponse> =>
    api.get(`${SEARCH}/email?email=${encodeURIComponent(searchContent)}&limit=${limit}&page=${page}`);

// ProductState Services
export const getAllProductStatus = (data: IGetAllProductByStateRequest): Promise<IGetAllProductByStateResponse> => {
    const search = encodeURIComponent(data?.searchContent ?? '');
    return api.get(`${PREFIX}/status/${data?.type}?limit=${data?.limit}&page=${data?.page}&search=${search}`);
};

export const getStatusCounts = (): Promise<IGetStatusCountsResponse> => api.get(`${PREFIX}/status/counts`);

export const getProductStatus = (id: string): Promise<IGetStatusResponse> => api.get(`${PREFIX}/${id}/status`);

export const addStatusOnProduct = (data: IAddingProductInLibraryRequest): Promise<IAddingProductInLibraryResponse> =>
    api.post(`${PREFIX}/status`, { inputData: data });

export const removeStatusFromProduct = (productId: string | number) => api.remove(`${PREFIX}/status/${productId}`);

// Rating Services
export const getProductRating = (id: string | number): Promise<IGetProductRatingResponse> =>
    api.get(`${PREFIX}/${id}/rating`);

export const rateProduct = (id: string | number, rating: number): Promise<IRateProductResponse> =>
    api.post(`${PREFIX}/${id}/rating`, { inputData: { rating } });
