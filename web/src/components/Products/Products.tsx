import React, { useEffect, useState } from 'react';
import styles from './Products.module.scss';
import {ProductModel} from "../../models/product.model";
import Lightbox, {Slide, SlotStyles} from 'yet-another-react-lightbox';
import {Captions, Fullscreen, Thumbnails, Zoom} from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import {ProductsStoreModel} from "../../models/products-store.model";

const Products: React.FC = () => {
    const [store, setStore] = useState<ProductsStoreModel | undefined>(undefined);
    const [chosen, setChosen] = useState<ProductModel | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/products.json?v=${new Date().getTime()}`);
            const jsonData = await response.json();

            setStore(Object.assign({} as ProductsStoreModel, jsonData));
        };

        fetchData();
    }, []);
    
    function openSlides(id: string) {
        setChosen(store?.Products.find(p => p.Id === id));
    }
    
    function setSlides(id: string) : Slide[] | undefined {
        if(!chosen)
            return;
        
        return chosen.Images.map(img => {
            return {src: img, alt: 'alt text'} as Slide;
        });
    }

    return (
        <>
        <div className={`${styles.gallery} font-agdasima grid grid-cols-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5text-white justify-center`}>
            {!store?.Products || store.Products.length === 0 && <span>No items.</span>}
            {store?.Products.map(product => (
                <div key={product.Id} className="product-card relative overflow-hidden w-64 h-64 border-2 border-amber-900 rounded-3xl group mx-auto my-4 " onClick={() => openSlides(product.Id)}>
                        <img src={`${product.ThumbnailUrl}`} alt={product.Name} className="mx-auto w-full h-full max-w-64 object-cover transform transition-transform duration-300 hover:scale-110" />
                        <div className="product-info absolute bottom-0 bg-black bg-opacity-50 text-white w-full text-center py-2 hidden group-hover:block">
                            <h3 className="text-lg">{product.Name}</h3>
                        </div>
                </div>
            ))}
        </div>

            { chosen &&
                <div className={'fixed font-agdasima top-[1rem] left-[1rem] w-[360px] h-auto z-[10000] bg-gray-900 bg-opacity-80 rounded-xl text-white opacity-0 animate-fade-in transition-opacity duration-700'}>
                    <h3 className={'p-2 font-bold bg-gray-700 bg-opacity-80 w-full rounded-t-xl'}>{chosen.Name}</h3>
                    <p className={'p-2'}>{chosen.Description}</p>
                </div>

            }
            
                <Lightbox
                    styles={{container: {slide: {captionSide: "bottom"}}} as SlotStyles}
                    slides={setSlides(chosen?.Id!)}
                    open={chosen !== undefined}
                    index={0}
                    close={() => setChosen(undefined)}
                    // enable optional lightbox plugins
                    plugins={[Fullscreen, Captions, Thumbnails, Zoom]}
                />

        </>
    );
};

export default Products;