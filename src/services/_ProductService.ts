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
export const getAllStatus = async (): Promise<IGetStatesResponse[]> => api.get(`${PREFIX}/status/all`);

// Product Services
export const getProducts = async (data: IGetProductsRequest): Promise<IGetProductsResponse> => {
    const statusQuery = data?.statusId ? `&status=${data.statusId}` : '';
    return api.get(`${PREFIX}?limit=${data?.limit}&page=${data?.page}&search=${data?.searchContent}${statusQuery}`);
};

export const getProduct = async (id: string): Promise<IGetProductResponse> => api.get(`${PREFIX}/` + id);

export const createProduct = async (data: ICreateProductRequest): Promise<ICreateProductResponse> =>
    api.post(`${PREFIX}`, { inputData: data });

export const editProduct = async (id: string, data: IEditProductRequest): Promise<IEditProductResponse> =>
    api.put(`${PREFIX}/` + id, { inputData: data });

export const deleteProduct = async (id: string) => api.remove(`${PREFIX}/` + id);

export const searchProductByEmailOnUser = async ({
    searchContent,
    page,
    limit,
}: ISearchProductByEmailRequest): Promise<ISearchProductByEmailResponse> =>
    api.get(`${SEARCH}/email?email=${searchContent}&limit=${limit}&page=${page}`);

// ProductState Services
export const getAllProductStatus = async (data: IGetAllProductByStateRequest): Promise<IGetAllProductByStateResponse> =>
    api.get(`${PREFIX}/status/${data?.type}?limit=${data?.limit}&page=${data?.page}&search=${data?.searchContent}`);

export const getStatusCounts = async (): Promise<IGetStatusCountsResponse> => api.get(`${PREFIX}/status/counts`);

export const getProductStatus = async (id: string): Promise<IGetStatusResponse> => api.get(`${PREFIX}/${id}/status`);

export const addStatusOnProduct = async (
    data: IAddingProductInLibraryRequest,
): Promise<IAddingProductInLibraryResponse> => api.post(`${PREFIX}/status`, { inputData: data });

export const removeStatusFromProduct = async (productId: string | number) =>
    api.remove(`${PREFIX}/status/${productId}`);

// Rating Services
export const getProductRating = async (id: string | number): Promise<IGetProductRatingResponse> =>
    api.get(`${PREFIX}/${id}/rating`);

export const rateProduct = async (id: string | number, rating: number): Promise<IRateProductResponse> =>
    api.post(`${PREFIX}/${id}/rating`, { inputData: { rating } });
