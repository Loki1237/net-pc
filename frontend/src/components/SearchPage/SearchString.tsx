import React from 'react';
import styles from './styles/SearchString.m.css';

import iconSearchGray from '../../shared/icons/icon_search_gray.png';

import { SearchedUser } from '../../store/SearchPage/types';

interface Props {
    userId: number,
    search: SearchedUser[],
    setSearchedUserList: Function
}

const SearchString = (props: Props) => {
    let [searchUserName, setSearchUserName] = React.useState("");
    const editSearchUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchUserName(e.target.value);
    }

    const search = async () => {
        const resSearch = await fetch(`/api/users/search/${props.userId}`, {
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
                onChange={editSearchUserName}
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
