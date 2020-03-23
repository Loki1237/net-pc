import React from 'react';
import styles from './styles/SearchContainer.m.css';
import { history } from '../middleware';

import { getMyId } from '../middleware';

import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import UserPrew from './UserPrew';

import defaultAvatar from '../../images/default_avatar.png';
import iconSearchGray from '../../components/icons/icon_search_gray.png';

import DialogsType from '../../types/DialogsType';

interface PropsType {
    setDialogUser: Function,
    setDialogMessages: Function,
    messages: DialogsType,
    search: any[]
}

interface StateType {
    searchedUserName: string,
    searchedUsers: any[]
}

class SearchPage extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            searchedUserName: "",
            searchedUsers: []
        };
    }

    search = async () => {
        const myId = await getMyId();

        const resSearch = await fetch(`/api/users/search/${myId}`, {
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
        const myId = await getMyId();

        const resDialogUser = await fetch(`/api/users/get_by_id/${id}`);
        const dialogUser = await resDialogUser.json();

        await this.props.setDialogUser(dialogUser);

        const resMessages = await fetch('/api/messages/get_dialog_messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: myId,
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
                <div className={styles.users_container}>
                    {this.props.search.map(user => {
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
