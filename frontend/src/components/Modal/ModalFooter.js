import React from 'react';
import styles from './Styles.m.css';

const ModalFooter = (props) => {
    return (
        <div align="right"
            className={styles.ModalFooter}>

            {props.children}

        </div>
    );
}

export default ModalFooter;
