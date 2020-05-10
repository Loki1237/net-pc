import React from 'react';
import styles from './NavBar.m.css';
import { Link } from 'react-router-dom';
import { Icon } from '../../shared';

interface Props {
    href: string,
    text: string,
    icon: string
}

const NavItem = (props: Props) => {
    return (
        <Link to={props.href} className={styles.NavItem}>
            <div className={styles.NavItem_text}>
                {props.text}
            </div>
            
            <Icon img={props.icon} />
        </Link>
    );
}

export default NavItem;
