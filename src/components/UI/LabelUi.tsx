import style from '@/styles/producForm.module.css';

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
    customClass?: string;
};

export const LabelUi = ({children, ...props}: Props) => {
    return (
        <label  
        {...props}
        className={style.label}
        >
            {children}
        </label>
    );
};