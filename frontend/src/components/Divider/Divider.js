import React from 'react';
import styles from './Divider.css';

const Divider = props => {
    return (
        <div 
            className={`${styles.Divider}
                ${props.space && styles[`${props.space}-space`]}`}>

        </div>
    );
}

export default Divider;
