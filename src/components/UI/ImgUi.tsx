import style from '@/styles/form.module.css';
import Image from "next/image";

interface ImagePreviewProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, width, height }) => {
    return (
        <Image 
        src={src} 
        width={width} 
        height={height} 
        alt={alt}
        className={style.imagePreview}
        />
    );
};
