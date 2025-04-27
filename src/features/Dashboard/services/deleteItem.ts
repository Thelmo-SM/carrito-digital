import { productsTypes } from "@/types/productTypes";
import { dataUsersTypes } from "@/types/usersTypes";
import { deleteDocument } from "./addDocumentServices";


export const deleteItem = async (item:productsTypes, userId: dataUsersTypes) => {

    const path = `users/${userId.uid}/products/${item.id}`;

    try {
        await deleteDocument(path);


    } catch (error: unknown) {
        console.log('Error al intentar eliminar un producto: ', error)
    }
    
};