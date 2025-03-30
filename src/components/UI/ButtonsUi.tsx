import style from '@/styles/producForm.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customClass?: string;
};

export const ButtonSubmitUi = ({ children, customClass, ...props }: Props) => {
    return (
        <button 
        {...props}
        className={`${style.button}
             ${customClass}`}
        >
            {children}
        </button>
    );
};

export const ButtonForm = ({ children, customClass, ...props }: Props) => {
    return (
        <button 
        {...props}
        className={`${style.button}
            ${customClass}`}
        >
            {children}
        </button>
    );
};