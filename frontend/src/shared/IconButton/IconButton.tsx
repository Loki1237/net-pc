import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    size?: string,
    disabled?: boolean,
    style?: object,
    children?: React.ReactNode,
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const IconButton = (props: Props) => {
    const iconButtonClassNames = classNames({
        [styles.IconButton]: true,
        [styles[`${props.size}`]]: props.size
    });

    return (
        <button
            className={iconButtonClassNames}
            style={props.style}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

export default IconButton;
