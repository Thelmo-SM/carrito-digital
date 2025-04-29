import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;


// Función para subir una imagen desde un archivo local
const uploadImage = async (imageFile: File) => {
    try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", uploadPreset!);

        // Realizar la solicitud a Cloudinary usando fetch
        const uploadResult = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const result = await uploadResult.json(); // Obtener la respuesta
        console.log("Imagen subida:", result);
        return result;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw new Error("Error al subir la imagen");
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
