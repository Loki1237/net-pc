import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { history, getMyId }  from './middleware';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'typeface-roboto';

import iconSearchWhite from './shared/icons/icon_search_white.png';
import iconMoreVerWhite from './shared/icons/icon_more_ver_white.png';
import logo from './images/logo-small.png';
import imgLeftCat from './images/cat-left.png';
import imgRightCat from './images/cat-right.png';

import {
    TopBar,
    Button,
    IconButton,
    DropdownContainer,
    DropdownMenu,
    DropdownItem,
    Divider
} from './shared';

import UserPage from './components/UserPage/UserPage';
import Notes from './components/Notes/Notes';
import Bookmarks from './components/Bookmarks/Bookmarks';
import BasicData from './components/Settings/BasicData';
import AboutSelf from './components/Settings/AboutSelf';
import Settings from './components/Settings/Settings';
import SwitchMode from './components/Settings/SwitchMode';
import AutBar from './components/AutBar/AutBar';
import NavBar from './components/NavBar/NavBar';
import Photo from './components/Photo/Photo';
import Messages from './components/Messages/Messages';

import AudioContainer from './store/music/containers/AudioContainer';
import AudioPlayer from './store/music/containers/AudioPlayer';
import AudioActions from './store/music/containers/AudioActions';

import SearchContainer from './store/search/containers/SearchContainer';
import SearchFilter from './store/search/containers/SearchFilter';
import SearchString from './store/search/containers/SearchString';

interface PropsType {
    
}

interface StateType {
    userId: number
}

class App extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            userId: 0
        };
    }

    async componentDidMount() {
        const myId = await getMyId();

        if (myId !== null) {
            this.setUserId(myId);
            const routes = /^\/(messages|music|bookmarks|notes|search|photo)$|\/edit|\/usr/;

            if (!routes.test(history.location.pathname)) {
                history.push(`/usr/${myId}`);
            }
        } else {
            history.push('/entry');
        }
    }

    setUserId = (value: number) => {
        this.setState({ userId: value });
    }

    exit = async () => {
        const res = await fetch('/api/auth/logout', { method: "HEAD" });

        if (res.status === 200) {
            history.push('/entry');
            this.setUserId(0);
        } else {
            console.log(res.status);
        }
    }

    render() {
        return (
            <div className='app-body'>
                <Router history={history}>
                    <Route path="/entry">
                        <img src={imgLeftCat} width={64} height={128} />
                        <AutBar setUserId={this.setUserId} />
                        <img src={imgRightCat} width={64} height={128} />
                    </Route>
                    
                    <Route path="/usr/:id?" render={props =>
                        <UserPage userId={this.state.userId} urlParams={props.match.params} />
                    }/>

                    <Route path="/messages">
                        <Messages />
                    </Route>

                    <Route path="/music">
                        <AudioActions />
                        <div className="vertical_container">
                            <AudioPlayer />
                            <AudioContainer />
                        </div>
                    </Route>

                    <Route path="/photo">
                        <Photo />
                    </Route>

                    <Route path="/bookmarks">
                        <Bookmarks/>
                    </Route>

                    <Route path="/notes">
                        <Notes />
                    </Route>

                    <Route path="/edit">
                        <SwitchMode />
                        <Switch>
                            <Route path="/edit/basic" component={BasicData} />
                            <Route path="/edit/about_self" component={AboutSelf} />
                            <Route path="/edit/settings" component={Settings} />
                        </Switch>
                    </Route>

                    <Route path="/search">
                        <SearchFilter />
                        <div className="vertical_container">
                            <SearchString />
                            <SearchContainer />
                        </div>
                    </Route>

                    {this.state.userId && 
                    <Route path="/">
                        <NavBar userId={this.state.userId} />
                    </Route>}
                </Router>

                <TopBar style={{ minWidth: 750 }}>
                    <div className="app_logo">
                        <img src={logo} width={26} height={26} />
                        <span>NetPC</span>
                    </div>

                    {this.state.userId && <IconButton onClick={() => history.push('/search')}>
                        <img src={iconSearchWhite} width={18} height={18} />
                    </IconButton>}

                    {this.state.userId && <DropdownContainer>
                        <IconButton>
                            <img src={iconMoreVerWhite} width={18} height={18} />
                        </IconButton>
                        <DropdownMenu placement="right" arrow={{ right: 12 }}>
                            <DropdownItem onClick={() => history.push('/edit')}>
                                Редактировать
                            </DropdownItem>

                            <Divider spaceY={4} spaceX={12}  />

                            <DropdownItem onClick={this.exit}>
                                Выйти
                            </DropdownItem>
                        </DropdownMenu>
                    </DropdownContainer>}
                </TopBar>

                <ToastContainer position="bottom-left" 
                    autoClose={6000}
                    newestOnTop={true}
                    closeButton={false}
                    draggable={false}
                    className="ToastContainer"
                    toastClassName="Toast"
                    progressClassName="Toast-progress"
                />
            </div>
        );
    }
}

export default App;
