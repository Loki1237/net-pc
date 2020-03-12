import React from 'react';
import styles from './ModalHeader.css';

const ModalHeader = (props) => {
    return (
        <div 
            className={`${styles.ModalHeader} 
                ${styles[`${props.color}`]}`}
        >

            {props.children}

        </div>
    );
}

export default ModalHeader;
