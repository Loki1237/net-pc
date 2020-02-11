import React from 'react';
import styles from './ModalHeader.css';

const ModalHeader = (props) => {
    return (
        <div 
            className={`${styles.ModalHeader} 
                ${styles[`${props.color}`]}`}>

            {props.children}

            <button 
                className={styles['close-button']}
                onClick={props.onClose}>
            </button>

        </div>
    );
}

export default ModalHeader;
