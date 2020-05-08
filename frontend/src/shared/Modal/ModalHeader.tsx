import React from 'react';
import styles from './Styles.m.css';

interface Props {
    children?: React.ReactNode
}

const ModalHeader = (props: Props) => {
    return (
        <div className={styles.ModalHeader}>
            {props.children}
        </div>
    );
}

export default ModalHeader;
