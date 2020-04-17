import React from 'react';
import styles from './Styles.m.css';

const Button = (props) => {
    return (
        <button {...props}
            className={`${styles.Button}
                ${props.size ? styles[`${props.size}`] : styles.medium}`}
            style={!props.disabled 
                ? {
                    background: props.color ? `var(--${props.color}-color)` : "#777",
                    ...props.style
                } 
                : { 
                    ...props.style 
                }
            }
        >
            {props.children}
        </button>
    );
}

export default Button;
