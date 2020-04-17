import React from 'react';
import styles from './Styles.m.css';

const Row = (props) => {
    return (
        <div className={styles.Row}
            style={{
                width: props.width,
                margin: `${props.spaceY || 0}px ${props.spaceX || 0}px`,
                ...props.style
            }}
        >
            {props.children}
        </div>
    );
}

export default Row;
