import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

interface Props {
    active?: boolean,
    href: string,
    onClick?: (event?: React.MouseEvent) => void,
    children?: any
}

const Tab = (props: Props) => {
    const tabClassNames = classNames({
        [styles.Tab]: true,
        [styles.active]: props.active
    });

    return (
        <Link to={props.href}
            className={tabClassNames}
            onClick={props.onClick}
        >
            {props.children}
        </Link>
    );
}

export default Tab;
