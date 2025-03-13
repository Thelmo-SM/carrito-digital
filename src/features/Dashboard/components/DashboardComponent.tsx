'use client';

import { signOut } from "@/utils/firebase"
import Items from "./Items";
import Style from '@/styles/dashboard.module.css'


export const DashboardComponent = () => {
    return (
        <div className={Style.container}>
        <button
        onClick={() => signOut()}
        >Cerrar sesión
        </button>

        <Items />
        </div>
    )
}

export default DashboardComponent;