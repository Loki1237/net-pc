import React from 'react';
import styles from './Divider.css';

const Divider = props => {
    return (
        <div 
            className={`${styles.Divider}
                ${props.indent && styles[`${props.indent}-indent`]}`}>

        </div>
    );
}

export default Divider;
