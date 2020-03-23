import React from 'react';
import styles from './Styles.m.css';

const ModalWindow = (props) => {
    return (
        <div 
            className={`${styles.ModalWindow}
                ${props.open && styles.opened}
                ${props.size && styles[`${props.size}`]}`}
        >
            {props.children}
        </div>
    );
}

export default ModalWindow;
