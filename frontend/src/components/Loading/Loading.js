import React from 'react';
import styles from './Loading.css';

const Loading = () => {
    return (
        <div className={styles.Loading}>
            <div className={`${styles.circle} ${styles.first}`}></div>
            <div className={`${styles.circle} ${styles.second}`}></div>
            <div className={`${styles.circle} ${styles.third}`}></div>
            <div className={`${styles.circle} ${styles.fourth}`}></div>
        </div>
    );
}

export default Loading;
