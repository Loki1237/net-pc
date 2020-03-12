import React from 'react';
import styles from './Dropdown.css';

const DropdownContainer = props => {
    return (
        <div className={styles.DropdownContainer}
            style={props.style}
        >
            {props.children}
        </div>
    );
}

export default DropdownContainer;
