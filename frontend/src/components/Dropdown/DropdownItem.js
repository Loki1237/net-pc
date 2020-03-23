import React from 'react';
import styles from './Styles.m.css';

const DropdownItem = props => {
    return (
        <div className={styles.DropdownItem}
            onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default DropdownItem;
