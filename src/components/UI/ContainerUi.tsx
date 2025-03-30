import style from '@/styles/producForm.module.css';
import { ReactNode } from 'react';

interface ContainerProp {
    children: ReactNode;
}


export const ContainerUi = ({children}: ContainerProp) => {
    return (
        <div className={style.container}>
            {children}
        </div>
    );
};