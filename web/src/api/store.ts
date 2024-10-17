import {ProductsStoreModel} from "../models/products-store.model";
import source from '../data/products.json';
const store : ProductsStoreModel = Object.assign({} as ProductsStoreModel, source);

export default store;