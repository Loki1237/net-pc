import React from 'react';
import styles from './styles/Message.m.css';
import classNames from 'classnames';
import defaultAvatar from '../../assets/images/default_avatar.png';

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
    state = {
        avatar: ""
    };

    async componentDidMount() {
        const resUser = await fetch(`/api/users/get_by_id/${this.props.userId}`);
        const user = await resUser.json();

        this.setState({ avatar: user.avatar !== "none" ? user.avatar : defaultAvatar });
    }

    render() {
        const messageClassNames = classNames({
            [styles.Message]: true,
            [styles.my]: this.props.my
        });

        return (
            <div className={messageClassNames}>
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