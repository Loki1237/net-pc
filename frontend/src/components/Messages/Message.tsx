import React from 'react';
import styles from './styles/Message.m.css';

import defaultAvatar from '../../images/default_avatar.png';

interface Props {
    userId: number,
    my: boolean,
    children: React.ReactNode,
    timestamp: string
}

interface State {
    avatar: string
}

class Message extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            avatar: ""
        };
    }

    async componentDidMount() {
        const resUser = await fetch(`/api/users/get_by_id/${this.props.userId}`);
        const user = await resUser.json();

        this.setState({ avatar: user.avatar !== "none" ? user.avatar : defaultAvatar });
    }

    render() {
        return (
            <div
                className={`${styles.Message}
                    ${this.props.my ? styles.my : ""}`}
            >
                <img className={styles.avatar}
                    src={this.state.avatar} 
                    width={16} height={16} 
                />

                <div className={styles.content}>
                    {this.props.children}
                    <p className={styles.timestamp}>{this.props.timestamp}</p>
                </div>
            </div>
        )
    }
}

export default Message;