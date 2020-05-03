import React from 'react';
import styles from './styles/SearchContainer.m.css';

import UserPrew from './UserPrew';

import { SearchedUser } from '../../store/SearchPage/types';

interface Props {
    userId: number,
    search: SearchedUser[]
}

interface State {
    
}

class SearchPage extends React.Component<Props, State> {
    componentWillUnmount() {

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
                                avatar={user.avatar}
                            />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default SearchPage;
