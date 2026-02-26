import React, {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import styles from './Products.module.scss';
import {ProductModel} from '../../models/product.model';
import {ProductsStoreModel} from '../../models/products-store.model';
import {mockedProductsStore} from '../../mocks/products.mock';

const baseUrl = import.meta.env.BASE_URL || '/';

const withBaseUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${baseUrl}${path.replace(/^\/+/, '')}`;
};

const normalizeStoreAssets = (data: ProductsStoreModel): ProductsStoreModel => ({
  ...data,
  Products: data.Products.map((product) => ({
    ...product,
    ThumbnailUrl: withBaseUrl(product.ThumbnailUrl),
    Images: product.Images.map(withBaseUrl),
  })),
});

const Products: React.FC = () => {
  const [store, setStore] = useState<ProductsStoreModel>();
  const [chosen, setChosen] = useState<ProductModel>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}products.json?v=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error(`Failed to load products.json (${response.status})`);
        }

        const jsonData = await response.json();
        const loadedStore = Object.assign({} as ProductsStoreModel, jsonData);

        if (!loadedStore?.Products?.length) {
          throw new Error('Loaded products list is empty.');
        }

        setStore(normalizeStoreAssets(loadedStore));
      } catch (error) {
        console.error('Using local mocked products because loading public/products.json failed.', error);
        setStore(normalizeStoreAssets(mockedProductsStore));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!chosen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setChosen(undefined);
      }
      if (event.key === 'ArrowRight') {
        goToNextImage();
      }
      if (event.key === 'ArrowLeft') {
        goToPrevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chosen, currentImageIndex]);

  const activeImage = useMemo(() => {
    if (!chosen?.Images?.length) {
      return '';
    }

    return chosen.Images[currentImageIndex] ?? chosen.Images[0];
  }, [chosen, currentImageIndex]);

  const openProduct = (product: ProductModel) => {
    setChosen(product);
    setCurrentImageIndex(0);
  };

  const goToPrevImage = () => {
    if (!chosen?.Images?.length) {
      return;
    }

    setCurrentImageIndex((prev) => (prev === 0 ? chosen.Images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    if (!chosen?.Images?.length) {
      return;
    }

    setCurrentImageIndex((prev) => (prev === chosen.Images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <motion.section
        className={styles.gallery}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {opacity: 0},
          visible: {
            opacity: 1,
            transition: {staggerChildren: 0.06},
          },
        }}
      >
        {!store?.Products?.length && <span className={styles.empty}>No items.</span>}

        {store?.Products.map((product) => (
          <motion.button
            type="button"
            key={product.Id}
            className={styles.card}
            variants={{hidden: {opacity: 0, y: 18}, visible: {opacity: 1, y: 0}}}
            transition={{duration: 0.38, ease: 'easeOut'}}
            onClick={() => openProduct(product)}
          >
            <img src={product.ThumbnailUrl} alt={product.Name} className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3>{product.Name}</h3>
            </div>
          </motion.button>
        ))}
      </motion.section>

      <AnimatePresence>
        {chosen && (
          <motion.section
            className={styles.viewerOverlay}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.28, ease: 'easeOut'}}
          >
            <button type="button" className={styles.backdrop} onClick={() => setChosen(undefined)} aria-label="Close" />

            <motion.div
              className={styles.viewer}
              initial={{opacity: 0, y: 20, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 10, scale: 0.98}}
              transition={{duration: 0.35, ease: 'easeOut'}}
            >
              <button type="button" className={styles.closeButton} onClick={() => setChosen(undefined)} aria-label="Close viewer">
                ×
              </button>

              {chosen.Images.length > 1 && (
                <button type="button" className={`${styles.arrowButton} ${styles.arrowLeft}`} onClick={goToPrevImage} aria-label="Previous image">
                  ‹
                </button>
              )}

              <div className={styles.imageWrap}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={chosen.Name}
                    className={styles.mainImage}
                    initial={{opacity: 0, y: 12}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.24, ease: 'easeOut'}}
                  />
                </AnimatePresence>
              </div>

              {chosen.Images.length > 1 && (
                <button type="button" className={`${styles.arrowButton} ${styles.arrowRight}`} onClick={goToNextImage} aria-label="Next image">
                  ›
                </button>
              )}

              {chosen.Images.length > 1 && (
                <div className={styles.thumbs}>
                  {chosen.Images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      className={`${styles.thumbButton} ${currentImageIndex === idx ? styles.thumbActive : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-label={`Open image ${idx + 1}`}
                    >
                      <img src={img} alt={`${chosen.Name} thumbnail ${idx + 1}`} className={styles.thumbImage} />
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.meta}>
                <h2>{chosen.Name}</h2>
                <p>{chosen.Description}</p>
                <span className={styles.counter}>{currentImageIndex + 1} / {chosen.Images.length}</span>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default Products;
