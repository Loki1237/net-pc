import React from 'react';
import styles from './styles/Conversation.m.css';
import classNames from 'classnames';
import { Icon, IconButton } from '../../shared';
import imgChat from '../../assets/images/chat.png';
import { User, Message } from '../../store/Messages/types';

interface Props {
    id: number,
    creatorId: number,
    isDialog: boolean,
    name: string,
    timestamp: Date,
    participants: User[],
    lastMessage: Message | null,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
    delete: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Conversation = (props: Props) => {
    let firstName = "";
    let lastName = "";
    let avatar = imgChat;
    let lastMessage = "";

    if (props.isDialog) {
        firstName = props.participants[0].firstName;
        lastName = props.participants[0].lastName;
        avatar = props.participants[0].avatar || imgChat;
    } else {
        firstName = props.name;
    }

    if (props.lastMessage) {
        lastMessage = props.lastMessage.author.firstName + ": " + props.lastMessage.text;
    }

    return (
        <div className={styles.Conversation}
            onClick={props.onClick}
        >
            <img src={avatar} className={styles.avatar} />

            <div className={styles.content}>
                <p className={styles.user_name}>
                    {firstName + " " + lastName}
                </p>
                
                <p className={styles.last_message}>
                    {lastMessage}
                </p>
            </div>

            <div className={styles.delete}>
                <IconButton size="very_small" 
                    onClick={props.delete}
                >
                    <Icon img="cross" color="gray" size="very_small" />
                </IconButton>
            </div>
        </div>
    )
}

export default Conversation;
