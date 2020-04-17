import React from 'react';
import styles from './Styles.m.css';

const Switch = props => {
    let key = 932;

    return (
        <div 
            className={`${styles.Switch}
                ${props.column ? styles.column : ""}
            `}
        >
            
            {props.children.map(elem => {
                key += 32;
                return React.cloneElement(elem, {
                    key,
                    size: props.size,
                    direction: props.column ? "column" : "row"
                });
            })}

        </div>
    );
}

export default Switch;
