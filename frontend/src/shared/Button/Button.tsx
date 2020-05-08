import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    size?: string,
    disabled?: boolean,
    style?: object,
    color?: string,
    children?: React.ReactNode,
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = (props: Props) => {
    const buttonClassNames = classNames({
        [styles.Button]: true,
        [styles[`${props.size}`]]: props.size
    });

    return (
        <button
            className={buttonClassNames}
            style={!props.disabled 
                ? {
                    background: props.color ? `var(--${props.color}-color)` : "#777",
                    ...props.style
                } 
                : { 
                    ...props.style 
                }
            }
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

export default Button;
