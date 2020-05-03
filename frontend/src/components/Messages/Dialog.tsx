import React from 'react';
import styles from './styles/Dialog.m.css';

import { IconButton } from '../../shared';

import iconCrossGray from '../../shared/icons/icon_cross_gray.png';
import defaultAvatar from '../../images/default_avatar.png';

interface Props {
    id: string,
    avatar: string,
    name: string,
    status: string,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const Dialog = (props: Props) => {
    const [firstName, lastName] = props.name.split(" ");
    const avatar = props.avatar !== "none" ? props.avatar : defaultAvatar;

    return (
        <div id={props.id}
            className={styles.Dialog}
            onClick={props.onClick}
        >
            <img src={avatar} className={styles.avatar} />

            <div className={styles.user_data}>
                <p className={styles.user_name}>{firstName}</p>
                <p className={styles.user_name}>{lastName}</p>
                
                <p className={styles["label-new_message"]}>Новое сообщение</p>
            </div>

            <div className={styles.right_column}>
                <IconButton size="very_small" 
                    onClick={(e: any) => {
                        e.stopPropagation();
                    }}
                >
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
