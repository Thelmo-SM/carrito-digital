import style from '@/styles/producForm.module.css';


interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    customClass?: string;
}

export const InputUi = (props: Props) => {
    return (
        <input
        className={style.input}
        {...props}
    />
    );
};