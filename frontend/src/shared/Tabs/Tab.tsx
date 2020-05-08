import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    size?: string,
    direction?: string,
    style?: object,
    active?: boolean,
    onClick?: (event?: React.MouseEvent) => void,
    children?: any
}

const Tab = (props: Props) => {
    const tabClassNames = classNames({
        [styles.Tab]: true,
        [styles[`${props.size}`]]: props.size,
        [styles.column_item]: props.direction === "column"
    });

    const tabStyle = {
        borderColor: props.active ? "var(--primary-color)" : "transparent",
        color: props.active ? "var(--primary-color)" : "#777",
        background: props.active && props.direction === "column" ? "#EEE" : "#FFF",
        ...props.style
    };

    return (
        <div className={tabClassNames}
            style={tabStyle}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}

export default Tab;
