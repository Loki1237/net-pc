import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';

import styles from './App.css';
import 'typeface-roboto';

import imgMyPage from '../components/icons/menu_my_page.png';
import imgBookmarks from '../components/icons/menu_bookmarks.png';
import imgNotes from '../components/icons/menu_notes.png';
import imgMessages from '../components/icons/menu_messages.png';
import imgSettings from '../components/icons/menu_settings.png';
import imgExit from '../components/icons/menu_exit.png';

import Backdrop from '../components/Backdrop/Backdrop';
import TopBar from '../components/TopBar/TopBar';
import SideMenu from '../components/SideMenu/SideMenu';
import SideMenuItem from '../components/SideMenu/SideMenuItem';
import SideMenuIcon from '../components/SideMenu/SideMenuIcon';
import Button from '../components/Button/Button';
import Divider from '../components/Divider/Divider';

import UserPage from './UserPage/UserPage';
import Notes from './Notes/Notes';
import Bookmarks from './Bookmarks/Bookmarks';
import Messages from '../containers/Messages';
import AutBar from '../containers/AutBar';

import AppStateType from '../types/AppStateType';

interface Props {
    appState: AppStateType,
    setUserId: any
}

interface State {
    SideMenu: boolean
}

class App extends React.Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            SideMenu: false
        };
    }

    async componentDidMount() {
        const res = await fetch('/api/users/login-as', { method: "POST" });

        if (res.status === 200) {
            const user = await res.json();
            this.props.setUserId(user.id);
            
            if (history.location.pathname === '/') {
                history.push('/my-page');
            }
        } else {
            this.props.setUserId(null);
            history.push('/entry');
        }
    }

    openSideMenu = () => {
        this.setState({ SideMenu: true });
    }

    closeSideMenu = () => {
        this.setState({ SideMenu: false });
    }

    exit = async () => {
        const res = await fetch('/api/users/logout', { method: "HEAD" });

        if (res.status === 200) {
            this.props.setUserId(null);
            this.closeSideMenu();
            history.push('/entry');
        }
    }

    render() {
        return (
            <div className={styles['app-body']}>

                <Backdrop 
                    isOpened={this.state.SideMenu}
                    onClose={this.closeSideMenu}
                >
                    <SideMenu>
                        <SideMenuItem onClick={() => history.push('/my-page')}>
                            <SideMenuIcon src={imgMyPage} />
                            Моя страница
                        </SideMenuItem>

                        <SideMenuItem onClick={() => history.push('/bookmarks')}>
                            <SideMenuIcon src={imgBookmarks} />
                            Закладки
                        </SideMenuItem>

                        <SideMenuItem onClick={() => history.push('/notes')}>
                            <SideMenuIcon src={imgNotes} />
                            Заметки
                        </SideMenuItem>

                        <SideMenuItem onClick={() => history.push('/messages')}>
                            <SideMenuIcon src={imgMessages} />
                            Сообщения
                        </SideMenuItem>

                        <SideMenuItem onClick={() => {}}>
                            <SideMenuIcon src={imgSettings} />
                            Настройки
                        </SideMenuItem>

                        <Divider indent="medium" />

                        <SideMenuItem onClick={this.exit}>
                            <SideMenuIcon src={imgExit} />
                            Выход
                        </SideMenuItem>
                    </SideMenu>
                </Backdrop>

                <Router history={history}>
                    <Route path="/entry">
                        <AutBar />
                    </Route>
                    
                    <Route path="/my-page">
                        <UserPage />
                    </Route>

                    <Route path="/bookmarks">
                        <Bookmarks/>
                    </Route>

                    <Route path="/notes">
                        <Notes />
                    </Route>

                    <Route path="/messages">
                        <Messages />
                    </Route>
                </Router>

                <TopBar>
                    {this.props.appState.userId !== null && <Button link
                        style={{ position: "absolute", right: 50 }}
                        onClick={this.openSideMenu}
                    >
                        MENU
                    </Button>}
                </TopBar>
            </div>
        );
    }
}

export default App;
