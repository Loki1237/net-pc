import React from 'react';
import styles from './styles/Dialog.m.css';
import classNames from 'classnames';
import { Icon, IconButton } from '../../shared';
import defaultAvatar from '../../assets/images/default_avatar.png';

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

    const statusClassNames = classNames({
        [styles.user_status]: true,
        [styles.online]: props.status === "online"
    });

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
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <Icon img="cross" color="gray" size="very_small" />
                </IconButton>

                <span className={statusClassNames}>
                    {props.status}
                </span>
            </div>
        </div>
    )
}

export default Dialog;
