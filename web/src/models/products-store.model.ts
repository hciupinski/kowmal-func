import {ProductModel} from "./product.model";

export interface ProductsStoreModel {
    UpdatedAt: string;
    Products: ProductModel[];
}