import React from 'react';
import styles from './styles/SearchString.m.css';

import { Icon } from '../../shared';

interface Props {
    search: (name: string) => void,
    resetState: () => void
}

const SearchString = (props: Props) => {
    let [name, setName] = React.useState("");
    const editName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const search = () => {
        props.search(name);
    }

    return (
        <div className={styles.SearchString}>
            <input type="text" 
                className={styles.input}
                placeholder="Имя Фамилия"
                value={name}
                onChange={editName}
            />

            <button className={styles.button}
                onClick={search}
            >
                <Icon img="search" color="gray" />
            </button>
        </div>
    )
}

export default SearchString;
