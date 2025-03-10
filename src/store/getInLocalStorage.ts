'use client';


export const getInLocalStorage = (key: string) => {
    return JSON.parse(localStorage.getItem(key) as string);
}