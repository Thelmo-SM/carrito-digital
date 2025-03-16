'use client';

import { useState } from "react";
import Style from '@/styles/producForm.module.css'

export const UploadImage = () => {
    const [file, setFile] = useState(null);

    return (
        <form onSubmit={ async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('image', file)

            const response = await fetch('api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data)
        }}>
            <label htmlFor="file_id">Imagen</label>
                <input 
                className={Style.image}
                type="file"
                id="file_id"
                onChange={(e) => {
                    setFile(e.target.files[0])
                }}
                />
                <button >Enviar</button>
        </form>
    )
}

export default UploadImage;