import React from 'react';
import styles from './NavBar.css';

const NavItem = (props: any) => {
    return (
        <div className={styles.NavItem}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}

export default NavItem;
