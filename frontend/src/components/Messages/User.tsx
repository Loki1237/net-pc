import React from 'react';
import styles from './styles/User.m.css';

import defaultAvatar from '../../assets/images/default_avatar.png';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

interface Props {
    id: number,
    firstName: string,
    lastName: string,
    avatar: string,
    selected?: boolean,
    actions: React.ReactElement | false
}

const User = (props: Props) => {
    const avatar = props.avatar || defaultAvatar;

    const classes = classNames({
        [styles.User]: true,
        [styles.selected]: props.selected
    });

    return (
        <div className={classes}>
            <img src={avatar} className={styles.avatar} />

            <div className={styles.user_name}>
                <Link to={`/usr/${props.id}`} className={styles.link}>
                    {props.firstName} {props.lastName}
                </Link>
            </div>

            {props.actions}
        </div>
    );
}

export default User;
