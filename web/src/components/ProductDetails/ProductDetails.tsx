import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import styles from './ProductDetails.module.scss';
import store from "../../api/store";
import {ProductModel} from "../../models/product.model";

interface Product {
    id: number;
    name: string;
    description: string;
    images: { url: string }[];
}

const ProductDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductModel | undefined>(undefined);

    useEffect(() => {
        setProduct(store.products.find(p => p.Id === id))
        console.log(product)
    }, [id]);

    if (!product) return <div className="text-white">Loading...</div>;

    return (
        <div className={`${styles.productDetails} p-6 text-white`}>
            <h2 className="text-3xl mb-4">{product.Name}</h2>
            <div>
                <h3 className="text-2xl mb-4">Description</h3>
                <p className="text-lg">{product.Description}</p>
            </div>
            <div className="images grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {product.Images.map((image, index) => (
                    <img src={image} alt={`${product.Name} ${index + 1}`} key={index} className="w-full h-auto"/>
                ))}
            </div>
        </div>
    );
};

export default ProductDetails;