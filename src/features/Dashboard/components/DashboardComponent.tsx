'use client';

import { signOut } from "@/utils/firebase"
import Items from "./Items";


export const DashboardComponent = () => {
    return (
        <div>
        <button
        onClick={() => signOut()}
        >Cerrar sesión
        </button>

        <Items />
        </div>
    )
}

export default DashboardComponent;