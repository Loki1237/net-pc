import React from 'react';
import styles from './Styles.m.css';

const Radio = (props) => {
    return (
        <input type="radio" className={styles.Radio} {...props} />
    );
}

export default Radio;
