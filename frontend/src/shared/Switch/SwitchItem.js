import React from 'react';
import styles from './Styles.m.css';

const SwitchItem = props => {
    return (
        <div 
            className={`${styles.SwitchItem}
                ${props.size ? styles[props.size] : ""}
                ${props.direction === "column" ? styles.column_item : ""}
            `}
            style={{
                borderColor: props.active ? "var(--primary-color)" : "transparent",
                color: props.active ? "var(--primary-color)" : "#777"
            }}
            onClick={props.onClick}>
            
            {props.children}

        </div>
    );
}

export default SwitchItem;
