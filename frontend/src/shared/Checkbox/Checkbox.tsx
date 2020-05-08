import React from 'react';
import styles from './Styles.m.css';

const Checkbox = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input type="checkbox" className={styles.Checkbox} {...props} />
    );
}

export default Checkbox;
