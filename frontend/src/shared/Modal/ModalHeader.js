import React from 'react';
import styles from './Styles.m.css';

const ModalHeader = (props) => {
    return (
        <div className={styles.ModalHeader}>

            {props.children}

        </div>
    );
}

export default ModalHeader;
