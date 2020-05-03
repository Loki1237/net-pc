import React from 'react';
import styles from './NavBar.m.css';
import { Link } from 'react-router-dom';

interface Props {
    href: string,
    text?: string,
    icon?: string
}

const NavItem = (props: Props) => {
    return (
        <Link to={props.href} className={styles.NavItem}>
            <div className={styles.NavItem_text}>
                {props.text}
            </div>
            <img src={props.icon} width={16} height={16} />
        </Link>
    );
}

export default NavItem;
