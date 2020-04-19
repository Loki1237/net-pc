import React from 'react';
import styles from './styles/SearchContainer.m.css';
import { history, getMyId } from '../../middleware';

import UserPrew from './UserPrew';

import defaultAvatar from '../../images/default_avatar.png';
import iconSearchGray from '../../shared/icons/icon_search_gray.png';

interface PropsType {
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
                            />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default SearchPage;
