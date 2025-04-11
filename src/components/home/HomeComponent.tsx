'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Img1 from '../../../public/HomeImg/img_1.webp';
import Img2 from '../../../public/HomeImg/img_2.webp';
import Img3 from '../../../public/HomeImg/img_3.webp';
import Img4 from '../../../public/HomeImg/img_4.webp';
import styles from '@/styles/homeCarrusel.module.css';
//import FeaturedCategories from './FeaturedCategories';
import FeaturedProducts from './FeaturedProducts';
import { useRouter } from 'next/navigation';

const images = [
  { src: Img1, text: "Gran variedad de CPU" },
  { src: Img2, text: "Gran variedad de Laptops" },
  { src: Img3, text: "Gran variedad de impresoras" },
  { src: Img4, text: "Gran variedad bocinas" }
];

export const HomeComponent = () => {
    const [current, setCurrent] = useState(0);
    const router = useRouter();

    const navigationProducts = () => {
      router.push('/products');
    }
    
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 500000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div>
         <article className={styles.carouselContainer}>
        <h1>Bienvenido/a a tu carrito digital</h1>
        <div className={styles.carouselTrack} style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((src, index) => (
            <div key={index} className={styles.slide}>
              <Image src={src.src} alt={`Slide ${index + 1}`} width={2000} height={600} className={styles.image} loading='lazy' />
              <div className={styles.textOverlay}>
                <h1>{src.text}</h1>
                <button onClick ={navigationProducts}
                  className={styles.verMas}>
                    Vermas
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Botones de navegación */}
        <button className={styles.prevButton} onClick={() => setCurrent((current - 1 + images.length) % images.length)}>&#10094;</button>
        <button className={styles.nextButton} onClick={() => setCurrent((current + 1) % images.length)}>&#10095;</button>
        {/* Indicadores */}
        <div className={styles.indicators}>
          {images.map((_, index) => (
            <span key={index} className={`${styles.dot} ${current === index ? styles.activeDot : ''}`}></span>
          ))}
        </div>
      </article>
      {/* <FeaturedCategories /> */}
      <FeaturedProducts />
      </div>
    );
};

export default HomeComponent;