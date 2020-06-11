import React from 'react';
import styles from './styles/Search.m.css';

import User from './User';
import { User as UserType } from '../../store/Search/types';
import { Loading, LoadingError } from '../../shared';

interface Props {
    isLoading: boolean,
    error: string,
    userList: UserType[],
    resetState: () => void
}

class SearchPage extends React.Component<Props> {
    componentWillUnmount() {
        this.props.resetState();
    }

    renderLoading = () => (
        <div className={styles.Container}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Container}>
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
            <div className={styles.Container}>
                {this.props.userList.map(user => {
                    return (
                        <User key={user.id}
                            id={user.id}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            avatar={user.avatar}
                        />
                    )
                })}
            </div>
        );
    }
}

export default SearchPage;
