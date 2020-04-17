import React from 'react';
import styles from './styles/SearchString.m.css';

import { getMyId } from '../../middleware';

import iconSearchGray from '../../shared/icons/icon_search_gray.png';

interface PropsType {
    search: any[],
    setSearchedUserList: Function
}

const SearchString = (props: PropsType) => {
    let [searchUserName, setSearchUserName] = React.useState("");

    const search = async () => {
        const myId = await getMyId();

        const resSearch = await fetch(`/api/users/search/${myId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                name: searchUserName
            })
        });
        const searchedUsers = await resSearch.json();

        props.setSearchedUserList(searchedUsers);
    }

    return (
        <div className={styles.SearchString}>
            <input type="text" 
                className={styles.input}
                placeholder="Имя Фамилия"
                value={searchUserName}
                onChange={(e: any) => {
                    setSearchUserName(e.target.value);
                }}
            />

            <button className={styles.button}
                onClick={search}
            >
                <img src={iconSearchGray} width={20} height={20} />
            </button>
        </div>
    )
}

export default SearchString;
