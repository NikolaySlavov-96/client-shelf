import { type IProduct, type IProductEmailType, type IProductWithState } from '~/Store/Slicers/ProductSlicer.interface';

export type TProductCard = IProductEmailType | IProductWithState | IProduct;
