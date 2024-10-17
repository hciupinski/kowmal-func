import {ProductsStoreModel} from "../models/products-store.model";
import {ProductModel} from "../models/product.model";
import axios from "axios";

const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_AUTH_BASE_URL}/api`,
});

export default apiClient;