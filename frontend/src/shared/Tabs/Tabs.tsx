import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    size?: string,
    direction?: string,
    children?: React.ReactElement[]
}

const Tabs = (props: Props) => {
    let key = 32;
    const tabsClassNames = classNames({
        [styles.Tabs]: true,
        [styles.column]: props.direction === "column"
    });

    return (
        <div className={tabsClassNames}>
            {props.children && props.children.map(elem => {
                key += 32;
                return React.cloneElement(elem, {
                    key,
                    size: props.size,
                    direction: props.direction
                });
            })}
        </div>
    );
}

export default Tabs;
