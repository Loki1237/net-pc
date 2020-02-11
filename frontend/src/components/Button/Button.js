import React from 'react';
import styles from './Button.css';

const Button = (props) => {
    return (
        <button 
            className={`${styles.Button} ${styles[`${props.color}`] || styles.primary}
                ${props.outline && `${styles.outline} ${styles[`${props.color}-font`] || styles['primary-outline']}`}
                ${props.link && `${styles[`${props.color}-font`]} ${styles.link}`}
                ${props.size ? styles[`${props.size}`] : styles.medium}`}
            style={props.style}
            onClick={props.onClick}>
            {props.children}
        </button>
    );
}

export default Button;
