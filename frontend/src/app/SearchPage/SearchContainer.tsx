import React from 'react';
import styles from './SearchContainer.css';
import history from '../history';

import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import InputField from '../../components/InputField/InputField';
import UserPrew from './UserPrew';

import defaultAvatar from '../../images/default_avatar.png';
import iconSearchGray from '../../components/icons/icon_search_gray.png';

import AppStateType from '../../types/AppStateType';
import DialogsType from '../../types/DialogsType';

interface Props {
    setDialogUser: any,
    setDialogMessages: any,
    messages: DialogsType
}

interface State {
    searchedUserName: string,
    searchedUsers: any[]
}

class SearchPage extends React.Component <Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            searchedUserName: "",
            searchedUsers: []
        };
    }

    search = async () => {
        const resUser = await fetch('/api/users/login-as', { method: "POST" });
        const user = await resUser.json();

        const resSearch = await fetch(`/api/users/search/${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                name: this.state.searchedUserName
            })
        });
        const searchedUsers = await resSearch.json();
        
        this.setState({ searchedUsers });
    }

    goToDialog = async (id: string) => {
        const resUser = await fetch('/api/users/login-as', { method: "POST" });
        const user = await resUser.json();

        const resDialogUser = await fetch(`/api/users/get_by_id/${id}`);
        const dialogUser = await resDialogUser.json();

        await this.props.setDialogUser(dialogUser);

        const resMessages = await fetch('/api/messages/get_dialog_messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: user.id,
                targetId: this.props.messages.selectedDialogUser.id
            })
        });
        let messages = await resMessages.json();
        
        this.props.setDialogMessages(messages);

        history.push('/messages');
    }

    render() {
        return (
            <div className={styles.SearchContainer}>
                <div className={styles.search_string}>
                    <InputField outline
                        style={{ width: 400, height: 32 }}
                        value={this.state.searchedUserName}
                        onChange={(e: any) => {
                            this.setState({ searchedUserName: e.target.value });
                        }}
                    />

                    <IconButton onClick={this.search}>
                        <img src={iconSearchGray} width={20} height={20} />
                    </IconButton>
                </div>

                <div className={styles.users_container}>
                    {this.state.searchedUsers.map(user => {
                        return (
                            <UserPrew key={user.id}
                                id={user.id}
                                name={user.name}
                                country={user.country}
                                city={user.city}
                                avatar={'/api/avatars/' + user.avatar} 
                                writeMessage={(e: any) => this.goToDialog(e.currentTarget.id)}
                            />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default SearchPage;
