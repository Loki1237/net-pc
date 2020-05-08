import React from 'react';
import styles from './Styles.m.css';

interface Props {
    spaceX?: number,
    spaceY?: number,
    bg?: string
}

const Divider = (props: Props) => {
    return (
        <div className={styles.Divider}
            style={{
                padding: `${props.spaceY || 0}px ${props.spaceX || 0}px`,
            }}
        >
            <div className={styles.line}
                style={{
                    backgroundColor: props.bg || "var(--line-color)"
                }}
            >
            </div>
        </div>
    );
}

export default Divider;
