import React from 'react';
import styles from './TopBar.m.css';

const TopBar = props => {
    return (
        <div className={styles.TopBar} style={props.style}>
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    );
}

export default TopBar;
