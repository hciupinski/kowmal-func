import {ProductModel} from "./product.model";

export interface ProductsStoreModel {
    updatedAt: string;
    products: ProductModel[];
}