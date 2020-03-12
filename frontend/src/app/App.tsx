import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';
import { Scrollbars } from 'react-custom-scrollbars';

import styles from './App.css';
import 'typeface-roboto';

import iconSearchWhite from '../components/icons/icon_search_white.png';
import logo from '../images/logo-small.png';
import bigLogo from '../images/logo-big.png';
import imgLeftCat from '../images/cat-left.png';
import imgRightCat from '../images/cat-right.png';

import ScrollbarThumbVertical from '../components/ScrollbarThumb/ScrollbarThumbVertical';
import ScrollbarThumbHorizontal from '../components/ScrollbarThumb/ScrollbarThumbHorizontal';
import TopBar from '../components/TopBar/TopBar';
import IconButton from '../components/IconButton/IconButton';
import Alert from '../components/Alert/Alert';

import UserPage from './UserPage/UserPage';
import Notes from '../containers/Notes';
import Bookmarks from './Bookmarks/Bookmarks';
import Settings from '../containers/Settings';
import Messages from '../containers/Messages';
import DialogList from '../containers/DialogList';
import AutBar from '../containers/AutBar';
import NavBar from '../containers/NavBar';
import SearchContainer from '../containers/SearchContainer';
import SearchFilter from './SearchPage/SearchFilter';

import AppStateType from '../types/AppStateType';
import AlertType from '../types/AlertType';

interface Props {
    appState: AppStateType,
    setNavBar: Function,
    alert: AlertType,
    closeAlert: Function
}

interface State {
    
}

const ScrollbarContentStyle: object = {
    width: "100%",
    height: "calc(100% - var(--TopBar-size))",
    boxSizing: "border-box",
    position: "fixed",
    left: 0,
    top: "var(--TopBar-size)"
}

class App extends React.Component <Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            
        };
    }

    async componentDidMount() {
        const res = await fetch('/api/users/login-as', { method: "POST" });

        if (res.status === 200) {
            const user = await res.json();
            this.props.setNavBar(true);
            
            if (history.location.pathname === '/') {
                history.push('/my-page');
            }
        } else {
            this.props.setNavBar(false);
            history.push('/entry');
        }
    }

    exit = async () => {
        const res = await fetch('/api/users/logout', { method: "HEAD" });

        if (res.status === 200) {
            this.props.setNavBar(false);
            history.push('/entry');
        } else {
            console.log(res.status);
        }
    }

    render() {
        return (
            <Scrollbars autoHide
                style={ScrollbarContentStyle}
                renderThumbVertical={ScrollbarThumbVertical}
                renderThumbHorizontal={ScrollbarThumbHorizontal}
            >
                <div className={styles['app-body']}>
                    
                    <Router history={history}>
                        <Route path="/entry">
                            <img src={imgLeftCat} width={64} height={128} />
                            <AutBar />
                            <img src={imgRightCat} width={64} height={128} />
                        </Route>
                        
                        <Route path="/my-page">
                            <UserPage />
                        </Route>

                        <Route path="/messages">
                            <DialogList />
                            <Messages />
                        </Route>

                        <Route path="/bookmarks">
                            <Bookmarks/>
                        </Route>

                        <Route path="/notes">
                            <Notes />
                        </Route>

                        <Route path="/search">
                            <SearchFilter />
                            <SearchContainer />
                        </Route>

                        <Route path="/settings">
                            <Settings />
                        </Route>
                    </Router>

                    {this.props.appState.NavBar && <NavBar />}

                    <TopBar style={{ minWidth: 750 }}>
                        <div className={styles.app_logo}>
                            <img src={logo} width={26} height={26} />
                            <span>NetPC</span>
                        </div>

                        <IconButton onClick={() => history.push('/search')}>
                            <img src={iconSearchWhite} width={18} height={18} />
                        </IconButton>
                    </TopBar>

                    <Alert type={this.props.alert.type} 
                        open={this.props.alert.isVisible}
                        onClose={this.props.closeAlert}
                        timestamp={this.props.alert.timestamp}
                        autoHideDuration={5000}
                    >
                        {this.props.alert.text}
                    </Alert>
                </div>
            </Scrollbars>
        );
    }
}

export default App;
