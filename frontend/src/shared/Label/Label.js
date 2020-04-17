import React from 'react';
import styles from './Styles.m.css';

const Label = (props) => {
    return (
        <label className={styles.Label}>
            {props.children}
        </label>
    );
}

export default Label;
