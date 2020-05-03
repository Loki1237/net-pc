import React from 'react';
import styles from './NavBar.m.css';

import NavItem from './NavItem';

import iconMyPage from '../../shared/icons/menu_my_page_primary.png';
import iconMessages from '../../shared/icons/menu_messages_primary.png';
import iconBookmarks from '../../shared/icons/menu_bookmarks_primary.png';
import iconNotes from '../../shared/icons/menu_notes_primary.png';
import iconMusic from '../../shared/icons/menu_music_primary.png';
import iconPhoto from '../../shared/icons/menu_photo_primary.png';

interface Props {
    userId: number
}

const NavBar = (props: Props) => {
    return (
        <div className={styles.NavBar}>
            <NavItem text="Моя страница"
                icon={iconMyPage}
                href={`/usr/${props.userId}`}
            />

            <NavItem text="Сообщения"
                icon={iconMessages}
                href='/messages'
            />

            <NavItem text="Аудиозаписи"
                icon={iconMusic}
                href='/music'
            />

            <NavItem text="Фотографии"
                icon={iconPhoto}
                href='/photo'
            />

            <NavItem text="Закладки"
                icon={iconBookmarks}
                href='/bookmarks'
            />

            <NavItem text="Заметки"
                icon={iconNotes}
                href='/notes'
            />
        </div>
    );
}

export default NavBar;
