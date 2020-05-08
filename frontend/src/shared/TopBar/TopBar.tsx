import React from 'react';
import styles from './TopBar.m.css';

interface Props {
    style?: object,
    children?: React.ReactNode
}

const TopBar = (props: Props) => {
    return (
        <div className={styles.TopBar} style={props.style}>
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    );
}

export default TopBar;
