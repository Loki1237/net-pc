import React from 'react';
import styles from './NavBar.m.css';

import NavItem from './NavItem';

interface Props {
    userId: number
}

const NavBar = (props: Props) => {
    return (
        <div className={styles.NavBar}>
            <NavItem text="Моя страница"
                icon="user_page"
                href={`/usr/${props.userId}`}
            />

            <NavItem text="Сообщения"
                icon="message"
                href='/messages'
            />

            <NavItem text="Аудиозаписи"
                icon="music"
                href='/music'
            />

            <NavItem text="Фотографии"
                icon="photo"
                href={`/photo/${props.userId}`}
            />

            <NavItem text="Закладки"
                icon="bookmark"
                href='/bookmarks'
            />

            <NavItem text="Заметки"
                icon="note"
                href='/notes'
            />
        </div>
    );
}

export default NavBar;
