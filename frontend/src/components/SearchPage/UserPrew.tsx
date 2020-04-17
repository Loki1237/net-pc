import React from 'react';
import styles from './styles/UserPrew.m.css';

import IconButton from '../../shared/IconButton/IconButton';

import iconMessage from '../../shared/icons/menu_messages.png';
import iconOpen from '../../shared/icons/icon_open.png';

interface PropsType {
    id: string,
    name: string,
    country: string,
    city: string,
    avatar: string
}

const UserPrew = (props: PropsType) => {
    return (
        <div className={styles.UserPrew}>
            <img src={props.avatar} className={styles.avatar} />

            <div className={styles.user_data}>
                <span>{props.name}</span>
                <span className={styles.residence_place}>
                    {`${props.country}, ${props.city}`}
                </span>
            </div>

            <IconButton size="small">
                <img width={12} height={12} 
                    src={iconOpen}
                    style={{ opacity: 0.9 }}
                />
            </IconButton>

            <IconButton size="small"
                id={props.id}
            >
                <img width={14} height={14} 
                    src={iconMessage}
                    style={{ opacity: 0.9 }}
                />
            </IconButton>
        </div>
    )
}

export default UserPrew;
