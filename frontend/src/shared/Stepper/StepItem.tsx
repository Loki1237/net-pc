import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    active: boolean
    completed: boolean
}

const StepperItem = (props: Props) => {
    const stepperClassNames = classNames({
        [styles.StepperItem]: true,
        [styles.active]: props.active,
        [styles.completed]: props.completed
    });

    return (
        <div className={stepperClassNames}></div>
    );
}

export default StepperItem;
