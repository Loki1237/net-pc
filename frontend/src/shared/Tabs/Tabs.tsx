import React from 'react';
import styles from './Styles.m.css';

interface Props {
    children: React.ReactElement[]
}

const Tabs = (props: Props) => {
    return (
        <div className={styles.Tabs}>
            {props.children}
        </div>
    );
}

export default Tabs;
