import React from 'react';
import styles from './Styles.m.css';

interface Props {
    style?: object,
    align?: string,
    children?: React.ReactNode
}

const ModalBody = (props: Props) => {
    const alignItems = props.align === "center" ? "center"
                     : props.align === "right" ? "flex-end"
                     : "flex-start";

    return (
        <div className={styles.ModalBody}
            style={{
                alignItems,
                ...props.style
            }}
        >
            {props.children}
        </div>
    );
}

export default ModalBody;
