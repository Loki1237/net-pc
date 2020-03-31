import React from 'react';
import { Router, Route } from 'react-router-dom';
import { history } from './middleware';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'typeface-roboto';

import { getMyId } from './middleware';

import iconSearchWhite from '../components/icons/icon_search_white.png';
import iconCrossWhite from '../components/icons/icon_cross_white.png';
import logo from '../images/logo-small.png';
import imgLeftCat from '../images/cat-left.png';
import imgRightCat from '../images/cat-right.png';

import TopBar from '../components/TopBar/TopBar';
import IconButton from '../components/IconButton/IconButton';

import UserPage from './UserPage/UserPage';
import Notes from './Notes/Notes';
import Bookmarks from './Bookmarks/Bookmarks';
import Settings from './Settings/Settings';
import Messages from '../containers/Messages';
import DialogList from '../containers/DialogList';
import AutBar from './AutBar/AutBar';
import NavBar from './NavBar/NavBar';
import SearchContainer from '../containers/SearchContainer';
import SearchFilter from './SearchPage/SearchFilter';
import SearchString from '../containers/SearchString';
import AudioContainer from '../containers/AudioContainer';
import AudioPlayer from '../containers/AudioPlayer';
import AudioActions from '../containers/AudioActions';

interface Props {
    
}

interface State {
    
}

class App extends React.Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            
        };
    }

    async componentDidMount() {
        const myId = await getMyId();

        if (myId !== null) {
            if (!/^\/(my-page|messages|music|bookmarks|notes|settings|search)$/.test(history.location.pathname)) {
                history.push('/my-page');
            }
        } else {
            history.push('/entry');
        }
    }

    exit = async () => {
        const res = await fetch('/api/auth/logout', { method: "HEAD" });

        if (res.status === 200) {
            history.push('/entry');
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
                        <AutBar />
                        <img src={imgRightCat} width={64} height={128} />
                    </Route>
                    
                    <Route path="/my-page">
                        <UserPage />
                        <NavBar />
                    </Route>

                    <Route path="/messages">
                        <DialogList />
                        <Messages />
                        <NavBar />
                    </Route>

                    <Route path="/music">
                        <AudioActions />
                        <div className="vertical_container">
                            <AudioPlayer />
                            <AudioContainer />
                        </div>
                        <NavBar />
                    </Route>

                    <Route path="/bookmarks">
                        <Bookmarks/>
                        <NavBar />
                    </Route>

                    <Route path="/notes">
                        <Notes />
                        <NavBar />
                    </Route>

                    <Route path="/search">
                        <SearchFilter />
                        <div className="vertical_container">
                            <SearchString />
                            <SearchContainer />
                        </div>
                        <NavBar />
                    </Route>

                    <Route path="/settings">
                        <Settings />
                        <NavBar />
                    </Route>
                </Router>

                <TopBar style={{ minWidth: 750 }}>
                    <div className="app_logo">
                        <img src={logo} width={26} height={26} />
                        <span>NetPC</span>
                    </div>

                    <IconButton onClick={() => history.push('/search')}>
                        <img src={iconSearchWhite} width={18} height={18} />
                    </IconButton>
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
