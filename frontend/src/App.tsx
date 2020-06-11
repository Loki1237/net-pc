import React from 'react';
import { Router, Route } from 'react-router-dom';
import { history }  from './middleware';
import './App.css';
import 'typeface-roboto';
import { toast as notify } from 'react-toastify';

import logo from './assets/images/logo-small.png';
import soundMessage from './assets/sounds/message.mp3';

import {
    Icon,
    IconButton,
    DropdownMenu,
    DropdownItem,
    Divider,
    NotificationProvider,
    TopBar
} from './shared';

import Notes from './containers/Notes/Notes';
import Bookmarks from './containers/Bookmarks/Bookmarks';
import Editing from './components/Editing/Editing';
import AutBar from './containers/AutBar/AutBar';
import NavBar from './components/NavBar/NavBar';
import Messages from './containers/Messages/Messages';
import Friends from './components/Friends/Friends';

import Music from './containers/Music/Music';
import Player from './containers/Music/Player';

import Search from './components/Search/Search';

import ImageViewer from './containers/ImageViewer/ImageViewer';
import UserPage from './containers/UserPage/UserPage';
import Photos from './containers/Photos/Photos';

interface Props {
    userIsLogged: boolean,
    userId: number,
    userLogIn: (id: number) => void,
    logInAs: () => void,
    logOut: () => void
}

class App extends React.Component<Props> {
    sendMessagesWebSocket: WebSocket = new WebSocket('ws://localhost:3001/api/messages/ws_send');
    soundMessage: HTMLAudioElement = new Audio(soundMessage);

    componentDidMount() {
        this.sendMessagesWebSocket.addEventListener('message', this.webSocketMessageHandler);

        this.props.logInAs();
    }

    webSocketMessageHandler = (e: MessageEvent) => {
        const message = JSON.parse(e.data);
        const { firstName, lastName } = message.author;

        if (message.author.id !== this.props.userId) {
            this.soundMessage.play();
            notify.info(`${firstName} ${lastName}: ${message.text}`);
        }
    }

    render() {
        return (
            <div className='app-body'>
                <Router history={history}>
                    <Route path="/auth/:mode?" render={props =>
                        <AutBar urlParamMode={props.match.params.mode}  />
                    }/>

                    <Route path="/usr/:id?/:action?" render={props =>
                        <UserPage urlParams={props.match.params} 
                            messagesSocket={this.sendMessagesWebSocket} 
                        />
                    }/>

                    <Route path="/messages">
                        <Messages messagesSocket={this.sendMessagesWebSocket} />
                    </Route>

                    <Route path="/friends/:section?" render={props =>
                        <Friends urlParam={props.match.params.section} />
                    }/>

                    <Route path="/music">
                        <div className="vertical_container">
                            <Player />
                            <Music />
                        </div>
                    </Route>

                    <Route path="/photo/:id?/:action?" render={props =>
                        <Photos urlParams={props.match.params} />
                    }/>

                    <Route path="/bookmarks">
                        <Bookmarks />
                    </Route>

                    <Route path="/notes">
                        <Notes />
                    </Route>

                    <Route path="/edit/:category?" render={props =>
                        <Editing urlParam={props.match.params.category} />
                    }/>

                    <Route path="/search">
                        <Search />
                    </Route>

                    {this.props.userIsLogged &&  
                        <Route path="/">
                            <NavBar userId={this.props.userId} />
                        </Route>
                    }

                    {this.props.userIsLogged &&  
                        <Route path="/">
                            <ImageViewer />
                        </Route>
                    }
                </Router>

                <TopBar style={{ minWidth: 750 }}>
                    <div className="app_logo">
                        <img src={logo} width={26} height={26} />
                        <span>Starsbook</span>
                    </div>

                    {this.props.userIsLogged && 
                        <IconButton onClick={() => history.push('/search')}>
                            <Icon img="search" color="white" />
                        </IconButton>
                    }

                    {this.props.userIsLogged &&
                        <DropdownMenu arrow
                            placement="right" 
                            control={
                                <IconButton>
                                    <Icon img="menu" color="white" />
                                </IconButton>
                            }
                        >
                            <DropdownItem onClick={() => history.push('/edit/basic')}>
                                Редактировать
                            </DropdownItem>

                            <Divider spaceY={4} spaceX={12}  />

                            <DropdownItem onClick={this.props.logOut}>
                                Выйти
                            </DropdownItem>
                        </DropdownMenu>
                    }
                </TopBar>

                <NotificationProvider />
            </div>
        );
    }
}

export default App;
