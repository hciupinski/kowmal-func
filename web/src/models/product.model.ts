import {PhotoModel} from "./photo.model";

export interface ProductModel {
    Id: string;
    Name: string;
    Description: string;
    Images: string[];
    ThumbnailUrl: string;
}