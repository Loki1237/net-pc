import React from 'react';
import styles from './Switch.css';

const Switch = props => {
    return (
        <div className={styles.Switch}>
            
            {props.children}

        </div>
    );
}

export default Switch;
