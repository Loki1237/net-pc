import React from 'react';
import styles from './SideMenu.css';

const SideMenuIcon = props => {
    return (
        <div className={styles.MenuIcon}>
            <img className={styles.MenuIconImg} src={props.src} />
        </div>
    );
}

export default SideMenuIcon;
