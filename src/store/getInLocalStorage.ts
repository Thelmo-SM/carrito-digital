'use client';


export const getInLocalStorage = (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null; // Retorna null si no hay datos
    try {
        return JSON.parse(item);
    } catch (error) {
        console.error("Error al parsear JSON de localStorage:", error);
        return null;
    }
};