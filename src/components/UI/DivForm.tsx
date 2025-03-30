import style from '@/styles/producForm.module.css';
import { ReactNode } from 'react';

interface DivFormProps {
    children: ReactNode;
}


export const DivForm = ({children}: DivFormProps) => {
    return (
        <div className={style.div}>
            {children}
        </div>
    );
};