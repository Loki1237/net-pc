import React from 'react';
import styles from './Styles.m.css';

interface Props {
    children: React.ReactNode
}

const Stepper = (props: Props) => {
    return (
        <div className={styles.Stepper}>
            {props.children}
        </div>
    );
}

export default Stepper;
