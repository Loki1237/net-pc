import React from 'react';
import styles from './Styles.m.css';

const Switch = props => {
    return (
        <div className={styles.Switch}>
            
            {props.children}

        </div>
    );
}

export default Switch;
