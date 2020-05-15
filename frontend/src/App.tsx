import React from 'react';
import { Router, Route } from 'react-router-dom';
import { history, getMyId }  from './middleware';
import './App.css';
import 'typeface-roboto';

import logo from './assets/images/logo-small.png';
import imgLeftCat from './assets/images/cat-left.png';
import imgRightCat from './assets/images/cat-right.png';

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
import CategoryTabs from './components/Editing/CategoryTabs';
import AutBar from './components/AutBar/AutBar';
import NavBar from './components/NavBar/NavBar';
import Messages from './containers/Messages/Messages';

import AudioContainer from './containers/Music/AudioContainer';
import AudioPlayer from './containers/Music/AudioPlayer';
import AudioActions from './containers/Music/AudioActions';

import SearchContainer from './containers/Search/SearchContainer';
import SearchFilter from './containers/Search/SearchFilter';
import SearchString from './containers/Search/SearchString';

import ImageViewer from './containers/ImageViewer/ImageViewer';
import UserPage from './containers/UserPage/UserPage';
import Photos from './containers/Photos/Photos';

interface Props {}

interface State {
    userId: number,
    userIsLogged: boolean
}

class App extends React.Component<Props, State> {
    state = {
        userId: 0,
        userIsLogged: false
    };

    async componentDidMount() {
        const myId = await getMyId();

        if (myId !== null) {
            this.setUserId(myId);
            const routes = /^\/(messages|music|bookmarks|notes|search)$|\/edit|\/usr|\/photo/;

            if (!routes.test(history.location.pathname)) {
                history.push(`/usr/${myId}`);
            }
        } else {
            history.push('/entry');
        }
    }

    setUserId = (value: number) => {
        this.setState({ userId: value, userIsLogged: !!value });
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
                    
                    <Route path="/usr/:id?/:action?" render={props =>
                        <UserPage userId={this.state.userId} urlParams={props.match.params} />
                    }/>

                    <Route path="/messages">
                        <Messages userId={this.state.userId} />
                    </Route>

                    <Route path="/music">
                        <AudioActions userId={this.state.userId} />
                        <div className="vertical_container">
                            <AudioPlayer />
                            <AudioContainer />
                        </div>
                    </Route>

                    <Route path="/photo/:id?/:action?" render={props =>
                        <Photos userId={this.state.userId} urlParams={props.match.params} />
                    }/>

                    <Route path="/bookmarks">
                        <Bookmarks />
                    </Route>

                    <Route path="/notes">
                        <Notes />
                    </Route>

                    <Route path="/edit/:category?" render={props =>
                        <CategoryTabs urlParam={props.match.params.category} />
                    }/>

                    <Route path="/edit/:category?" render={props =>
                        <Editing userId={this.state.userId} urlParam={props.match.params.category} />
                    }/>

                    <Route path="/search">
                        <SearchFilter />
                        <div className="vertical_container">
                            <SearchString />
                            <SearchContainer />
                        </div>
                    </Route>

                    {this.state.userIsLogged &&  
                        <Route path="/">
                            <NavBar userId={this.state.userId} />
                        </Route>
                    }

                    {this.state.userIsLogged &&  
                        <Route path="/">
                            <ImageViewer userId={this.state.userId} />
                        </Route>
                    }
                </Router>

                <TopBar style={{ minWidth: 750 }}>
                    <div className="app_logo">
                        <img src={logo} width={26} height={26} />
                        <span>NetPC</span>
                    </div>

                    {this.state.userIsLogged && 
                        <IconButton onClick={() => history.push('/search')}>
                            <Icon img="search" color="white" />
                        </IconButton>
                    }

                    {this.state.userIsLogged &&
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

                            <DropdownItem onClick={this.exit}>
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
