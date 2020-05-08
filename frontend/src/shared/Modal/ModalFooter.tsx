import React from 'react';
import styles from './Styles.m.css';

interface Props {
    children?: React.ReactNode
}

const ModalFooter = (props: Props) => {
    return (
        <div className={styles.ModalFooter}>
            {props.children}
        </div>
    );
}

export default ModalFooter;
