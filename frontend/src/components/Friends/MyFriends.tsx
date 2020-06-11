import React from 'react';
import styles from './Styles.m.css';

import User from './User';
import { User as UserData } from '../../store/Friends/types';
import { Button, TextArea, Loading, LoadingError } from '../../shared';

interface Props {
    isLoading: boolean,
    error: string,
    friendList: UserData[],
    updateFriendList: () => void,
    deleteFriend: (id: number) => void,
    resetState: () => void
}

class MyFriends extends React.Component<Props> {
    componentDidMount() {
        this.props.updateFriendList();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    renderLoading = () => (
        <div className={styles.Friends}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Friends}>
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
            <div className={styles.container}>
                {this.props.friendList.map(friend => (
                    <User key={friend.id}
                        id={friend.id}
                        firstName={friend.firstName}
                        lastName={friend.lastName}
                        avatar={friend.avatar}
                        online={friend.online}
                    />
                ))}
            </div>
        );
    }
}

export default MyFriends;
