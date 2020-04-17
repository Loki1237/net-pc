import React from 'react';
import styles from './NavBar.m.css';
import { history } from '../../middleware';

import Divider from '../../shared/Divider/Divider';
import NavItem from './NavItem';

import iconMyPage from '../../shared/icons/menu_my_page_primary.png';
import iconMessages from '../../shared/icons/menu_messages_primary.png';
import iconBookmarks from '../../shared/icons/menu_bookmarks_primary.png';
import iconNotes from '../../shared/icons/menu_notes_primary.png';
import iconMusic from '../../shared/icons/menu_music_primary.png';
import iconPhoto from '../../shared/icons/menu_photo_primary.png';
import iconSettings from '../../shared/icons/menu_settings_primary.png';
import iconExit from '../../shared/icons/menu_exit_primary.png';

const NavBar = () => {
    return (
        <div className={styles.NavBar}>
            <NavItem text="Моя страница"
                icon={iconMyPage}
                onClick={() => history.push('/my-page')}
            />

            <NavItem text="Сообщения"
                icon={iconMessages}
                onClick={() => history.push('/messages')}
            />

            <NavItem text="Аудиозаписи"
                icon={iconMusic}
                onClick={() => history.push('/music')}
            />

            <NavItem text="Фотографии"
                icon={iconPhoto}
                onClick={() => history.push('/photo')}
            />

            <NavItem text="Закладки"
                icon={iconBookmarks}
                onClick={() => history.push('/bookmarks')}
            />

            <NavItem text="Заметки"
                icon={iconNotes}
                onClick={() => history.push('/notes')}
            />
        </div>
    );
}

export default NavBar;
