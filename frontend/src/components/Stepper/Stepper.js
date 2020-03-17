import React from 'react';
import styles from './Stepper.css';

const Stepper = props => {
    return (
        <div className={styles.Stepper}>
            
            {props.children.map(elem => elem)}

        </div>
    );
}

export default Stepper;
