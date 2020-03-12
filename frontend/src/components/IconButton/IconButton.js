import React from 'react';
import styles from './IconButton.css';

const IconButton = props => {
    return (
        <button id={props.id}
            className={`${styles.IconButton}
                ${styles[`${props.size}`]}`}
            style={props.style}
            title={props.title}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            <div className={styles.icon}>
                {props.children}
            </div>
        </button>
    );
}

export default IconButton;
