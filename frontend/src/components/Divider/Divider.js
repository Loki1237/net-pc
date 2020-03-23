import React from 'react';
import styles from './Styles.m.css';

const Divider = props => {
    
    return (
        <div className={styles.Divider}
            style={{
                margin: `${props.spaceY || 0}px ${props.spaceX || 0}px`,
                backgroundColor: props.bg || "var(--line-color)"
            }}
        >

        </div>
    );
}

export default Divider;
