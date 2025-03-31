'use client';


export const getInLocalStorage = (key: string) => {
    if (typeof window === "undefined") return null; // Asegura que solo se ejecute en el cliente

    const item = localStorage.getItem(key);
    if (!item) return null; // Evita parsear valores nulos o vacíos

    try {
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error al parsear JSON desde localStorage (${key}):`, error);
        return null;
    }
};