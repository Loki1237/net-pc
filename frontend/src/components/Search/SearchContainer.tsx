import React from 'react';
import styles from './styles/SearchContainer.m.css';

import UserPrew from './UserPrew';
import { User } from '../../store/Search/types';
import { Loading, LoadingError } from '../../shared';

interface Props {
    isLoading: boolean,
    error: string,
    userList: User[],
    resetState: () => void
}

class SearchPage extends React.Component<Props> {
    componentWillUnmount() {
        this.props.resetState();
    }

    renderLoading = () => (
        <div className={styles.SearchContainer}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.SearchContainer}>
            <LoadingError error={this.props.error} />
        </div>
    );

    render() {
        if (this.props.error) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.SearchContainer}>
                <div className={styles.users_container}>
                    {this.props.userList.map(user => {
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
