import React from 'react';
import styles from './Styles.m.css';

interface Props {
    error: string
}

const LoadingError = (props: Props) => {
    return (
        <p className={styles.LoadingError}>
            {props.error}
        </p>
    );
}

export default LoadingError;
