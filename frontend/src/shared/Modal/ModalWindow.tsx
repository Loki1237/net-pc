import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    isOpened: boolean,
    size?: string,
    children?: React.ReactNode
}

const ModalWindow = (props: Props) => {
    const modalWindowClassNames = classNames({
        [styles.ModalWindow]: true,
        [styles[`${props.size}`]]: props.size,
        [styles.opened]: props.isOpened
    });

    return (
        <div className={modalWindowClassNames}>
            {props.children}
        </div>
    );
}

export default ModalWindow;
