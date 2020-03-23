import React from 'react';
import styles from './Styles.m.css';

const SwitchItem = props => {
    return (
        <div 
            className={`${styles.SwitchItem}
                ${props.active && styles.active}`}
            onClick={props.onClick}>
            
            {props.children}

        </div>
    );
}

export default SwitchItem;
