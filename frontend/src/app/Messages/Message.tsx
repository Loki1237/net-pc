import React from 'react';
import styles from './styles/Message.m.css';

interface PropsType {
    userId: number,
    my: boolean,
    children: any,
    timestamp: string
}

interface StateType {
    avatar: string
}

class Message extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            avatar: ""
        };
    }

    async componentDidMount() {
        const resUser = await fetch(`/api/users/get_by_id/${this.props.userId}`);
        const user = await resUser.json();

        this.setState({ avatar: '/api/avatars/' + user.avatar });
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