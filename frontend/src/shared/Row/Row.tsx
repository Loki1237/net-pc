import React from 'react';
import styles from './Styles.m.css';

interface Props {
    width?: number,
    spaceX?: number,
    spaceY: number,
    style?: object,
    children?: React.ReactNode
}

const Row = (props: Props) => {
    return (
        <div className={styles.Row}
            style={{
                width: props.width,
                margin: `${props.spaceY || 0}px ${props.spaceX || 0}px`,
                ...props.style
            }}
        >
            {props.children}
        </div>
    );
}

export default Row;
