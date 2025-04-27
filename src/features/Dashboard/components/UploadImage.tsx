'use client';

import { useState } from "react";
import Style from '@/styles/producForm.module.css'

export const UploadImage = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="file_id">Imagen</label>
            <input 
                className={Style.image}
                type="file"
                id="file_id"
                onChange={(e) => {
                    const selectedFile = e.target.files?.[0] ?? null;
                    setFile(selectedFile);
                }}
            />
            <button type="submit">Enviar</button>
        </form>
    );
}

export default UploadImage;
