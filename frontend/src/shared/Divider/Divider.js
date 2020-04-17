import React from 'react';
import styles from './Styles.m.css';

const Divider = props => {
    
    return (
        <div className={styles.Divider}
            style={{
                padding: `${props.spaceY || 0}px ${props.spaceX || 0}px`,
            }}
        >
            <div className={styles.line}
                style={{
                    backgroundColor: props.bg || "var(--line-color)"
                }}
            >
            </div>
        </div>
    );
}

export default Divider;
