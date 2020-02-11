import React from 'react';
import styles from './IconButton.css';

const IconButton = props => {
    return (
        <div className={styles.IconButton}
            style={props.style}
            onClick={props.onClick}
        >
            
            {props.plus && <div className={styles.plus}></div>}

        </div>
    );
}

export default IconButton;
