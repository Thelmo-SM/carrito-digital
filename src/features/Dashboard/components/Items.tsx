'use client';

import CreateProduct from "./CreateProduct";
import { getCollection } from "@/utils/firebase";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useEffect } from "react";

export const Items = () => {

    const user = useAuthUsers();

    const getItems = async () => {
        const path = `users/${user?.uid}/products`;

        try {
            const data = await getCollection(path);
            console.log('Productos agregados: ',data);
        } catch (error: unknown) {
            console.log('Error en alo leer productos: ', error)
        }
    };

    useEffect(() => {
        if(user) {
            getItems();
        }
    }, [user]);

    return (
        <div>
            <CreateProduct />
        </div>
    );
};

export default Items;