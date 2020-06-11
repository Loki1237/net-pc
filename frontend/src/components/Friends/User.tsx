import React from 'react';
import styles from './Styles.m.css';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../assets/images/default_avatar.png';

interface Props {
    id: number,
    avatar: string,
    firstName: string,
    lastName: string,
    online: boolean,
    children?: React.ReactElement | React.ReactElement[]
}

const User = (props: Props) => {
    const avatar = props.avatar || defaultAvatar;

    return (
        <Link to={`/usr/${props.id}`} className={styles.User}>
            <img src={avatar} />
            <p>{props.firstName + " " + props.lastName}</p>

            <div className={styles.buttons}>
                {props.children}
            </div>
        </Link>
    );
}

export default User;
