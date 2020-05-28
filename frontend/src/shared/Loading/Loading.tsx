import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    size?: "small" | "medium"
}

const Loading = (props: Props) => {
    const circles = ["first", "second", "third", "fourth"];

    const loadingClassNames = classNames({
        [styles.Loading]: true,
        [styles.small]: props.size === "small"
    });

    return (
        <div className={loadingClassNames}>
            {circles.map(circle => (
                <div className={classNames([styles.circle], [styles[circle]])} key={circle}></div>
            ))}
        </div>
    );
}

export default Loading;
