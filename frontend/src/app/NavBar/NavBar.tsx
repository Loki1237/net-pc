import React from 'react';
import styles from './NavBar.css';
import history from '../history';

import Divider from '../../components/Divider/Divider';
import NavItem from './NavItem';
import Tooltip from '../../components/Tooltip/Tooltip';

import iconMyPage from '../../components/icons/menu_my_page_primary.png';
import iconBookmarks from '../../components/icons/menu_bookmarks_primary.png';
import iconNotes from '../../components/icons/menu_notes_primary.png';
import iconMessages from '../../components/icons/menu_messages_primary.png';
import iconSettings from '../../components/icons/menu_settings_primary.png';
import iconExit from '../../components/icons/menu_exit_primary.png';

interface PropsType {
    setNavBar: Function
}

const NavBar = (props: PropsType) => {
    const exit = async () => {
        const res = await fetch('/api/users/logout', { method: "HEAD" });

        if (res.status === 200) {
            history.push('/entry');
            props.setNavBar(false);
        } else {
            console.log(res.status);
        }
    }

    return (
        <div className={styles.NavBar}>
            <NavItem
                onClick={() => history.push('/my-page')}
            >
                <img src={iconMyPage} width={16} height={16} />
                <Tooltip placement="left">Моя страница</Tooltip>
            </NavItem>

            <NavItem
                onClick={() => history.push('/messages')}
            >
                <img src={iconMessages} width={16} height={16} />
                <Tooltip placement="left">Сообщения</Tooltip>
            </NavItem>

            <NavItem
                onClick={() => history.push('/bookmarks')}
            >
                <img src={iconBookmarks} width={16} height={16} />
                <Tooltip placement="left">Закладки</Tooltip>
            </NavItem>

            <NavItem
                onClick={() => history.push('/notes')}
            >
                <img src={iconNotes} width={16} height={16} />
                <Tooltip placement="left">Заметки</Tooltip>
            </NavItem>

            <NavItem
                onClick={() => history.push('/settings')}
            >
                <img src={iconSettings} width={16} height={16} />
                <Tooltip placement="left">Настройки</Tooltip>
            </NavItem>

            <Divider />

            <NavItem
                onClick={exit}
            >
                <img src={iconExit} width={16} height={16} />
                <Tooltip placement="left">Выход</Tooltip>
            </NavItem>
        </div>
    );
}

export default NavBar;
