import React from 'react';
import styles from './styles/Message.m.css';
import classNames from 'classnames';

interface Props {
    isMy: boolean,
    text: string,
    timestamp: string
}

const Message = (props: Props) => {
    const messageClassNames = classNames({
        [styles.Message]: true,
        [styles.my]: props.isMy
    });

    return (
        <div className={messageClassNames}>
            <div className={styles.content}>
                {props.text}
            </div>

            <span className={styles.timestamp}>
                {props.timestamp}
            </span>
        </div>
    )
}

export default Message;