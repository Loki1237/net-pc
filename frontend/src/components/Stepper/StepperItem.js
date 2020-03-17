import React from 'react';
import styles from './Stepper.css';

const StepperItem = props => {
    return (
        <div className={`${styles.StepperItem}
            ${props.selected ? styles.selected : ""}
            ${props.completed ? styles.completed : ""}`}
        >
            
        </div>
    );
}

export default StepperItem;
