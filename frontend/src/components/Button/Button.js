import React from 'react';
import styles from './Styles.m.css';

const Button = (props) => {
    return (
        <button 
            className={`${styles.Button}
                ${props.size ? styles[`${props.size}`] : styles.medium}`}
            style={{
                background: props.color ? `var(--${props.color}-color)` : "#777",
                ...props.style
            }}
            onClick={props.onClick}
            title={props.title}
        >
            {props.children}
        </button>
    );
}

export default Button;
