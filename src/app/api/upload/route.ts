import { NextResponse } from "next/server";
// import path from "path";
// import { writeFile } from "fs/promises";
import { cloudinary } from "@/utils/cloudinary";

export async function POST(request: Request) {
    const data = await request.formData();
  
    // Obtener el archivo 'image'
    const image = data.get('image') as File | null;
  
    if (!image) {
      return NextResponse.json('No se ha subido ninguna imagen', {
        status: 400,
      });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (err, result) => {
          if (err) {
              reject(err);
          }
          resolve(result); // Debe resolver con el objeto de resultado
      }).end(buffer);
  });
  
  console.log(response); // Verifica la respuesta completa
  
  // Ahora enviamos el secure_url en la respuesta
  return NextResponse.json({ secure_url: (response as any).secure_url });
  }