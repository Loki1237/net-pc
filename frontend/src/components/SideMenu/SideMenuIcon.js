import React from 'react';
import styles from './SideMenu.css';

const SideMenuIcon = props => {
    return (
        <img 
            className={styles.MenuIcon}
            src={props.src} 
        />
    );
}

export default SideMenuIcon;
