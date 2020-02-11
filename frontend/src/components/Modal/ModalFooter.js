import React from 'react';
import styles from './ModalFooter.css';

const ModalFooter = (props) => {
    return (
        <div align="right"
            className={styles.ModalFooter}>

            {props.children}

        </div>
    );
}

export default ModalFooter;
