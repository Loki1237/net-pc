import React from 'react';
import styles from './NavBar.m.css';
import { history } from '../middleware';

import Divider from '../../components/Divider/Divider';
import NavItem from './NavItem';

import iconMyPage from '../../components/icons/menu_my_page_primary.png';
import iconBookmarks from '../../components/icons/menu_bookmarks_primary.png';
import iconNotes from '../../components/icons/menu_notes_primary.png';
import iconMessages from '../../components/icons/menu_messages_primary.png';
import iconSettings from '../../components/icons/menu_settings_primary.png';
import iconExit from '../../components/icons/menu_exit_primary.png';

const NavBar = () => {
    const exit = async () => {
        const res = await fetch('/api/auth/logout', { method: "HEAD" });

        if (res.status === 200) {
            history.push('/entry');
        } else {
            console.log(res.status);
        }
    }

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

            <NavItem text="Закладки"
                icon={iconBookmarks}
                onClick={() => history.push('/bookmarks')}
            />

            <NavItem text="Заметки"
                icon={iconNotes}
                onClick={() => history.push('/notes')}
            />

            <NavItem text="Настройки"
                icon={iconSettings}
                onClick={() => history.push('/settings')}
            />

            <Divider />

            <NavItem text="Выход"
                icon={iconExit}
                onClick={exit}
            />
        </div>
    );
}

export default NavBar;
