import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    value: string,
    children: string,
    selected?: boolean,
    onClick?: () => void
}

const Option = (props: Props) => {
    const optionClassNames = classNames({
        [styles.option]: true,
        [styles.selected]: props.selected
    });

    return (
        <div className={optionClassNames} onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default Option;
