 import style from '@/styles/form.module.css';


interface MessageProp {
    children: string;
}

export const MessageErrror = ({children}: MessageProp) => {
    return (
        <div className={style.mesageError}>
                {/* <Image src='' width={100} height={100} alt="" 
                className=""
                /> */}
                <p className="">{children}</p>
            </div>
    );
};