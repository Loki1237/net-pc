import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

const Loading = () => {
    const circles = ["first", "second", "third", "fourth"];

    return (
        <div className={styles.Loading}>
            {circles.map(circle => (
                <div className={classNames([styles.circle], [styles[circle]])} key={circle}></div>
            ))}
        </div>
    );
}

export default Loading;
