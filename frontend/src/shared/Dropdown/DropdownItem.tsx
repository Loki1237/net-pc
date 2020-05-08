import React from 'react';
import styles from './Styles.m.css';

interface Props {
    onClick?: (event?: React.MouseEvent) => void,
    children: React.ReactNode
}

const DropdownItem = (props: Props) => {
    return (
        <div className={styles.DropdownItem}
            onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default DropdownItem;
