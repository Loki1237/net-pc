import React from 'react';
import styles from './Tooltip.css';

const Tooltip = props => {
    return (
        <div className={`${styles.Tooltip}
            ${props.placement ? styles[`${props.placement}`] : styles.top}`}
            data-title={props.children}
        >
            
        </div>
    )
}

export default Tooltip;
