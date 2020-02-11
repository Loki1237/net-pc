import React from 'react';
import styles from './TopBar.css';
import menuIcon from '../icons/button_menu.png';

const TopBar = props => {
    return (
        <div className={styles.TopBar}>
            
            {props.children}

        </div>
    );
}

export default TopBar;
