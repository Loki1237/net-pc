import React from 'react';
import styles from './styles/User.m.css';
import { Link } from 'react-router-dom';

import defaultAvatar from '../../assets/images/default_avatar.png';

interface Props {
    id: number,
    firstName: string,
    lastName: string,
    avatar: string
}

const User = (props: Props) => {
    const avatar = props.avatar || defaultAvatar;

    return (
        <Link to={`/usr/${props.id}`} className={styles.User}>
            <img src={avatar} />
            <p>{props.firstName + " " + props.lastName}</p>
        </Link>
    );
}

export default User;
