import React from 'react';
import styles from './Styles.m.css';

const StepperItem = props => {
    return (
        <div className={`${styles.StepperItem}
            ${props.active ? styles.active : ""}
            ${props.completed ? styles.completed : ""}`}
        >
            
        </div>
    );
}

export default StepperItem;
