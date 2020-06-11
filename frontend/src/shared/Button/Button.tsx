import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    size?: "small" | "medium" | "large",
    disabled?: boolean,
    style?: object,
    color?: "primary" | "secondary" | "info" | "success" | "warning" | "error",
    variant?: "text" | "filled",
    children?: React.ReactNode,
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = (props: Props) => {
    const buttonClassNames = classNames({
        [styles.Button]: true,
        [styles[`${props.size}`]]: props.size,
        [styles.only_text]: props.variant === "text"
    });

    const style = {
        "--bg_color": props.variant !== "text" ? `var(--${props.color || "default"}-color)` : "transparent",
        "--text_color": props.variant === "text" ? `var(--${props.color || "default"}-color)` : "#FFF"
    } as React.CSSProperties;

    return (
        <button
            className={buttonClassNames}
            style={{
                ...style,
                ...props.style
            }}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

export default Button;
