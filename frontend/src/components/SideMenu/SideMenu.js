import React from 'react';
import styles from './SideMenu.css';

const SideMenu = props => {
    return (
        <div 
            className={`${styles.SideMenu}
                ${props.open && styles.opened}`}
        >
            {props.children}
        </div>
    );
}

export default SideMenu;
