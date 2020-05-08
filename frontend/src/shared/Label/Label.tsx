import React from 'react';
import styles from './Styles.m.css';

interface Props {
    children: any
}

const Label = (props: Props) => {
    return (
        <label className={styles.Label}>
            {props.children}
        </label>
    );
}

export default Label;
