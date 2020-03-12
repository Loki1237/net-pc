import React from 'react';
import styles from './Text.css';

const Text = props => {
    return (
        <p 
            className={`${styles.Text}
                ${props.header && styles.header}`}
            style={{
                textAlign: props.align,
                ...props.style
            }}
            onClick={props.onClick}
        >
            {props.children}
        </p>
    );
}

export default Text;
