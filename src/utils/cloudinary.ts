import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, 
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Función para subir una imagen desde un archivo local
const uploadImage = async (imageFile: File) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
            public_id: `products/${imageFile.name}`, // Se puede cambiar el public_id según lo necesites
        });
        console.log('Imagen subida:', uploadResult);
        return uploadResult;
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw new Error('Error al subir la imagen');
    }
};

// Función para optimizar la URL de una imagen
const getOptimizedImageUrl = (publicId: string) => {
    return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
    });
};

// Función para transformar la imagen (por ejemplo, redimensionar)
const getTransformedImageUrl = (publicId: string, width: number, height: number) => {
    return cloudinary.url(publicId, {
        crop: 'auto',
        gravity: 'auto',
        width,
        height,
    });
};

// Simulamos la subida de una imagen (esto se puede adaptar a un evento de formulario)
const simulateImageUpload = async () => {
    const imageFile = {
        path: 'ruta/a/tu/imagen.jpg', // Aquí debe ir la ruta de la imagen que quieras subir
        name: 'mi_imagen.jpg',
    };
    
    try {
        const uploadResult = await uploadImage(imageFile as unknown as File);
        const publicId = uploadResult.public_id;
        
        // Obtener la URL optimizada
        const optimizedUrl = getOptimizedImageUrl(publicId);
        console.log('URL optimizada:', optimizedUrl);

        // Obtener la URL transformada (por ejemplo, redimensionada)
        const transformedUrl = getTransformedImageUrl(publicId, 500, 500);
        console.log('URL transformada:', transformedUrl);
    } catch (error) {
        console.error('Hubo un problema con la carga de la imagen:', error);
    }
};

// Ejecutamos el proceso
simulateImageUpload();
