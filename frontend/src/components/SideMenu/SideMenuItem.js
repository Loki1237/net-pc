import React from 'react';
import styles from './SideMenu.css';

const SideMenuItem = props => {
    return (
        <div className={styles.MenuItem}
            onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default SideMenuItem;
