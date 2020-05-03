import React from 'react';
import styles from './styles/UserPrew.m.css';
import { Link } from 'react-router-dom';

import defaultAvatar from '../../images/default_avatar.png';

interface Props {
    id: number,
    name: string,
    country: string,
    city: string,
    avatar: string
}

const UserPrew = (props: Props) => {
    const avatar = props.avatar !== "none" ? props.avatar : defaultAvatar;

    return (
        <Link to={`/usr/${props.id}`} className={styles.UserPrew}>
            <img src={avatar} className={styles.avatar} />

            <div className={styles.user_data}>
                <span>{props.name}</span>
                <span className={styles.residence_place}>
                    {`${props.country}, ${props.city}`}
                </span>
            </div>
        </Link>
    );
}

export default UserPrew;
