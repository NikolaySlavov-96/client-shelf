import { type StateCreator } from 'zustand';

import { TEXTS } from '~/constants';

import { createLogger } from '~/Utils';

import { FileService as fileService, ProductService as productService } from '~/services';
import { Toast } from '~/Toasts';
import { ESwalIcon } from '~/Types/Swal';

const log = createLogger('ProductSlicer');

const showActionError = (err: unknown) => {
    const message = (err as { message?: string })?.message;
    Toast({ title: message ?? TEXTS.TOAST_GENERIC_ERROR, typeIcon: ESwalIcon.ERROR });
};

import {
    type IAddProductWithImage,
    type IFetchQueryParams,
    type IFetchSearchParams,
    type IProduct,
    type IProductEmailType,
    type IProductRating,
    type IProductWithState,
    type IState,
    type IStatusCount,
} from './ProductSlicer.interface';

export interface IProductSlicer {
    isLoadingProducts: boolean;
    isLoadingProductByEmails: boolean;
    isLoadingProduct: boolean;
    isLoadingProductState: boolean;
    isLoadingProductCollection: boolean;
    isLoadingProductAddition: boolean;
    isAddingProductState: boolean;

    productStates: IState[];
    fetchAllProductStates: () => void;

    productByEmail: { count: number; rows: IProductEmailType[] };
    fetchProductsForEmail: (data: IFetchSearchParams) => void;

    products: { count: number; rows: IProduct[] };
    fetchProducts: (data: IFetchSearchParams) => void;

    productById: IProduct;
    fetchProductById: (id: string) => void;

    productState: { stateId: number };
    fetchProductState: (id: string) => void;
    addingProductState: (id: string, state: string, activeFilterId?: number | null) => void;

    productRating: IProductRating;
    fetchProductRating: (id: string) => void;
    rateProduct: (id: string, rating: number) => Promise<void>;

    productCollection: { count: number; rows: IProductWithState[] };
    fetchProductCollection: (data: IFetchQueryParams) => void;
    removeProductState: (productId: number) => Promise<void>;
    updateShelfStatus: (productId: number, nextStatusId: number, activeStatusId?: number | null) => Promise<void>;

    statusCounts: IStatusCount[];
    fetchStatusCounts: () => void;

    isProductAdded: boolean;
    addProductWithImage: (data: IAddProductWithImage['data'], fileData: IAddProductWithImage['fileDate']) => void;
}

// Recompute per-status counts after a single book moves: -1 from its old status (if any),
// +1 to the new one. Keeps the profile shelf tallies in sync without an extra request.
const recountStatuses = (
    counts: IStatusCount[],
    previousStatusId: number | null,
    nextStatusId: number,
): IStatusCount[] => {
    const byId = new Map(counts.map((c) => [c.statusId, c.count]));
    if (previousStatusId !== null) {
        byId.set(previousStatusId, Math.max(0, (byId.get(previousStatusId) ?? 0) - 1));
    }
    byId.set(nextStatusId, (byId.get(nextStatusId) ?? 0) + 1);
    return Array.from(byId.entries()).map(([statusId, count]) => ({ statusId, count }));
};

const createProductSlicer: StateCreator<IProductSlicer> = (set, get) => ({
    isLoadingProducts: false,
    isLoadingProductByEmails: false,
    isLoadingProduct: false,
    isLoadingProductState: false,
    isLoadingProductCollection: false,
    isLoadingProductAddition: false,
    isAddingProductState: false,

    productStates: [],
    fetchAllProductStates: async () => {
        try {
            const result = await productService.getAllStatus();
            set({ productStates: result });
        } catch (err) {
            log.error('fetchAllProductStates error --->: ', err);
        }
    },

    productByEmail: { count: 0, rows: [] },
    fetchProductsForEmail: async (data) => {
        set({ isLoadingProductByEmails: true });
        try {
            const result = await productService.searchProductByEmailOnUser(data);
            set({ productByEmail: result });
        } catch (err) {
            log.error('fetchProductsForEmail error --->: ', err);
        } finally {
            set({ isLoadingProductByEmails: false });
        }
    },

    products: { count: 0, rows: [] },
    fetchProducts: async (data) => {
        // set({ error: null, loading: true })
        set({ isLoadingProducts: true });
        try {
            const result = await productService.getProducts(data);
            set({ products: result });
        } catch (err) {
            log.error('fetchProducts error --->: ', err);
            // set({ error: error.message })
        } finally {
            set({ isLoadingProducts: false });
        }
    },

    productById: {
        productId: 0,
        productType: '',
        productStatus: false,
        productTitle: '',
        pages: null,
        publishedYear: null,
        description: null,
        ratingAverage: 0,
        ratingCount: 0,
        authors: [],
        authorsSeparator: ',',
        fileUrl: '',
        fileId: 0,
        fileSrc: '',
    },
    fetchProductById: async (id) => {
        set({ isLoadingProduct: true });
        try {
            const { products } = get();
            const isProductExist = products.rows.filter((p) => p.productId === Number(id));
            if (isProductExist?.length) {
                set({ productById: isProductExist[0] });
            }

            const resultFromRequest = await productService.getProduct(id);
            set({ productById: resultFromRequest });
        } catch (err) {
            log.error('fetchProductById error --->: ', err);
        } finally {
            set({ isLoadingProduct: false });
        }
    },

    productState: { stateId: 0 },
    fetchProductState: async (id) => {
        set({ isLoadingProductState: true });
        try {
            const result = await productService.getProductStatus(id);
            set({ productState: { stateId: result.statusId } });
        } catch (err) {
            log.error('fetchProductState error --->: ', err);
        } finally {
            set({ isLoadingProductState: false });
        }
    },
    addingProductState: async (id, state, activeFilterId = null) => {
        const productId = Number(id);
        const nextStatusId = Number(state);

        const { products, statusCounts } = get();
        const currentRow = products.rows.find((p) => p.productId === productId);
        const previousStatusId = currentRow?.statusId ?? null;

        if (previousStatusId === nextStatusId) {
            set({ productState: { stateId: nextStatusId } });
            return;
        }

        const leavesCurrentSection = activeFilterId !== null && activeFilterId !== 0 && nextStatusId !== activeFilterId;

        const nextRows = leavesCurrentSection
            ? products.rows.filter((p) => p.productId !== productId)
            : products.rows.map((p) => (p.productId === productId ? { ...p, statusId: nextStatusId } : p));

        const nextCount = leavesCurrentSection ? Math.max(0, products.count - 1) : products.count;

        set({ isAddingProductState: true });
        try {
            await productService.addStatusOnProduct({ productId: id, statusId: state });
            set({
                products: { count: nextCount, rows: nextRows },
                statusCounts: recountStatuses(statusCounts, previousStatusId, nextStatusId),
                productState: { stateId: nextStatusId },
            });
        } catch (err) {
            log.error('addingProductState error --->: ', err);
            showActionError(err);
        } finally {
            set({ isAddingProductState: false });
        }
    },

    productRating: { average: 0, count: 0, userRating: 0 },
    fetchProductRating: async (id) => {
        try {
            const result = await productService.getProductRating(id);
            set({ productRating: result });
        } catch (err) {
            log.error('fetchProductRating error --->: ', err);
        }
    },
    rateProduct: async (id, rating) => {
        const { productRating } = get();
        const previous = productRating;

        set({ productRating: { ...productRating, userRating: rating } });

        try {
            const result = await productService.rateProduct(id, rating);
            set({ productRating: result });
        } catch (err) {
            log.error('rateProduct error --->: ', err);
            showActionError(err);
            set({ productRating: previous });
        }
    },

    productCollection: { count: 0, rows: [] },
    fetchProductCollection: async (data) => {
        set({ isLoadingProductCollection: true });
        try {
            const result = await productService.getAllProductStatus(data);
            set({ productCollection: result });
        } catch (err) {
            log.error('fetchProductCollection error --->: ', err);
        } finally {
            set({ isLoadingProductCollection: false });
        }
    },

    statusCounts: [],
    fetchStatusCounts: async () => {
        try {
            const result = await productService.getStatusCounts();
            set({ statusCounts: result });
        } catch (err) {
            log.error('fetchStatusCounts error --->: ', err);
        }
    },

    removeProductState: async (productId) => {
        const { productCollection } = get();
        const previousRows = productCollection.rows;
        const optimisticRows = previousRows.filter((p) => p.productId !== productId);

        set({
            productCollection: {
                count: Math.max(0, productCollection.count - (previousRows.length - optimisticRows.length)),
                rows: optimisticRows,
            },
        });

        try {
            await productService.removeStatusFromProduct(productId);
            get().fetchStatusCounts();
        } catch (err) {
            log.error('removeProductState error --->: ', err);
            showActionError(err);
            set({ productCollection: { count: productCollection.count, rows: previousRows } });
        }
    },

    updateShelfStatus: async (productId, nextStatusId, activeStatusId = null) => {
        const { productCollection, statusCounts } = get();
        const currentRow = productCollection.rows.find((p) => p.productId === productId);
        const previousStatusId = currentRow?.productStateId ?? null;

        if (previousStatusId === nextStatusId) return;

        const leavesCurrentSection = activeStatusId !== null && activeStatusId !== 0 && nextStatusId !== activeStatusId;

        const previousRows = productCollection.rows;
        const previousCount = productCollection.count;

        const nextRows = leavesCurrentSection
            ? previousRows.filter((p) => p.productId !== productId)
            : previousRows.map((p) => (p.productId === productId ? { ...p, productStateId: nextStatusId } : p));
        const nextCount = leavesCurrentSection ? Math.max(0, previousCount - 1) : previousCount;

        set({
            productCollection: { count: nextCount, rows: nextRows },
            statusCounts: recountStatuses(statusCounts, previousStatusId, nextStatusId),
        });

        try {
            await productService.addStatusOnProduct({ productId: String(productId), statusId: String(nextStatusId) });
        } catch (err) {
            log.error('updateShelfStatus error --->: ', err);
            showActionError(err);
            // rollback both the rows and the counts
            set({
                productCollection: { count: previousCount, rows: previousRows },
                statusCounts,
            });
        }
    },

    isProductAdded: false,
    addProductWithImage: async (data, fileData) => {
        set({ isLoadingProductAddition: true });
        try {
            const formData = new FormData();
            formData.append('deliverFile', fileData.file);
            formData.append('src', fileData.name);

            const fileResponseData = await fileService.sendFile(
                formData as unknown as { deliverFile: File; src: string },
            );

            await productService.createProduct({ ...data, filesId: [fileResponseData.fileId] });

            set({ isProductAdded: true });
        } catch (err) {
            log.error('addProductWithImage --->: ', err);
            showActionError(err);
        } finally {
            set({ isLoadingProductAddition: false });
        }
    },
});

export default createProductSlicer;

// const onSubmitEditProduct = useCallback(async (data: any) => {
//     try {
//         const prod = await productService.editProduct(data._id, data);
//         // setBook(p => p?.rows.map(x => x.id === data.id ? prod : x));

//         // navigate(ROUT_NAMES.HOME);
//     } catch (err) {
//         console.log('onSubmitEditProduct --->: ', err);
//     }
// }, []);

// const onSubmitDeleteProduct = useCallback(async (id: string) => {
//     try {
//         await productService.deleteProduct(id);
//         // setBook(p => p.filter(prod => prod._id !== id));

//         // navigate(ROUT_NAMES.HOME);
//     } catch (err) {
//         console.log('onSubmitDeleteProduct --->: ', err);
//     }
// }, []);
