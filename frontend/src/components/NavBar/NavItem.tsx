import React from 'react';
import styles from './NavBar.m.css';

const NavItem = (props: any) => {
    return (
        <div className={styles.NavItem}
            onClick={props.onClick}
        >
            <div className={styles.NavItem_text}>
                {props.text}
            </div>
            <img src={props.icon} width={16} height={16} />
        </div>
    );
}

export default NavItem;
