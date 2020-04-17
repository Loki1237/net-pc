import React from 'react';
import styles from './Styles.m.css';

const IconButton = props => {
    return (
        <button {...props}
            className={`${styles.IconButton}
                ${styles[`${props.size}`]}
                ${props.box ? styles.box : ""}
            `}
        >
            {props.children}
        </button>
    );
}

export default IconButton;
