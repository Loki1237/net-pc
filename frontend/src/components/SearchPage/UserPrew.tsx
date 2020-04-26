import React from 'react';
import styles from './styles/UserPrew.m.css';
import { Link } from 'react-router-dom';

import { IconButton } from '../../shared';

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
        <Link to={`/usr/${props.id}`} className={styles.UserPrew}>
            <img src={props.avatar} className={styles.avatar} />

            <div className={styles.user_data}>
                <span>{props.name}</span>
                <span className={styles.residence_place}>
                    {`${props.country}, ${props.city}`}
                </span>
            </div>
        </Link>
    )
}

export default UserPrew;
