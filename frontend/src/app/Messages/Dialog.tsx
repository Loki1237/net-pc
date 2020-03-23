import React from 'react';
import styles from './styles/Dialog.m.css';

import IconButton from '../../components/IconButton/IconButton';
import Tooltip from '../../components/Tooltip/Tooltip';

import iconCrossGray from '../../components/icons/icon_cross_gray.png';

interface PropsType {
    id: string,
    avatar: string,
    name: string,
    status: string,
    onClick: any
}

const Dialog = (props: PropsType) => {
    const [firstName, lastName] = props.name.split(" ");

    return (
        <div id={props.id}
            className={styles.Dialog}
            onClick={props.onClick}
        >
            <img src={props.avatar} className={styles.avatar} />

            <div className={styles.user_data}>
                <p className={styles.user_name}>{firstName}</p>
                <p className={styles.user_name}>{lastName}</p>
                
                <p className={styles["label-new_message"]}>Новое сообщение</p>
            </div>

            <div className={styles.right_column}>
                <IconButton size="very_small">
                    <img src={iconCrossGray} width={8} height={8} />
                </IconButton>

                <span className={`${styles.user_status}
                    ${props.status === "online" ? styles.online : ""}`}
                >
                    {props.status}
                </span>
            </div>
        </div>
    )
}

export default Dialog;
