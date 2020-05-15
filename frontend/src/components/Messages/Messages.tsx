import React from 'react';
import styles from './styles/Messages.m.css';

import Message from './Message';
import Dialog from './Dialog';
import { User as UserType, Message as MessageType } from '../../store/Messages/types';

import { Icon, Loading } from '../../shared';
import TextareaAutosize from 'react-textarea-autosize';
import imgDialog from '../../assets/images/dialog.png';

interface Props {
    userId: number,
    isLoading: boolean,
    hasErrored: boolean,
    userList: UserType[],
    messageList: MessageType[],
    currentUser: UserType,
    updateUserList: () => void,
    selectDialog: (user: UserType) => void,
    sendMessage: (targetId: number, content: string) => void,
    resetCurrentUser: () => void,
    resetState: () => void
};

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
];

class Messages extends React.Component<Props> {
    messageContainer: React.RefObject<HTMLDivElement> = React.createRef();
    state = {
        message: "",
    };

    componentDidMount() {
        this.props.updateUserList();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.messageList.length !== prevProps.messageList.length) {
            this.messageContainer.current?.scrollTo(0, this.messageContainer.current?.scrollHeight);
            this.setState({ message: "" });
        }
    }

    writeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ message: e.target.value });
    }

    sendMessage = async () => {
        this.props.sendMessage(this.props.currentUser.id, this.state.message);
    }

    setTimestamp = (miliseconds: string) => {
        const date = new Date(+miliseconds);

        let day = `${date.getDate()}`;
        day = day.length < 2 ? `0${day}` : day;
        let month = `${monthList[date.getMonth()]}`;
        let year = `${date.getFullYear()}`;

        let hours = `${date.getHours()}`;
        hours = hours.length < 2 ? `0${hours}` : hours;
        let minutes = `${date.getMinutes()}`;
        minutes = minutes.length < 2 ? `0${minutes}` : minutes;
        
        if (new Date().getFullYear() === date.getFullYear()) {
            return `${hours}:${minutes} / ${day} ${month}.`;
        } else {
            return `${hours}:${minutes} / ${day} ${month}. ${year}`;
        }
    }

    renderLoading = () => (
        <div className={styles.Messages}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Messages}>
            <h1>Error</h1>
        </div>
    );

    render() {
        if (this.props.hasErrored) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.Messages}>
                <div className={styles.dialog_column}>
                    {/* ------- Заголовок ------- */}
                    <div className={styles.header}
                        onClick={this.props.resetCurrentUser}
                    >
                        Диалоги
                    </div>

                    {/* ------- Список дилогов ------- */}
                    <div className={styles.dialog_list}>
                        {this.props.userList.map((user) => {
                            return (
                                <Dialog key={user.id}
                                    avatar={user.avatar} 
                                    name={user.name}
                                    status={user.status}
                                    onClick={() => this.props.selectDialog(user)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className={styles.content_column}>
                    {/* ------- Заголовок ------- */}
                    <div className={styles.message_container_header}>
                        {this.props.currentUser.name || "Сообщения"}
                    </div>

                    {/* ------- Контейнер сообщения ------- */}
                    <div className={styles.message_container} ref={this.messageContainer}>
                        {this.props.messageList.map(message => {
                            const timestamp = this.setTimestamp(message.timestamp);

                            return (
                                <Message key={message.id}
                                    my={message.userId === this.props.userId}
                                    timestamp={timestamp}
                                >
                                    {message.content}
                                </Message>
                            )
                        })}

                        {this.props.currentUser.id === 0 &&
                            <div className={styles.dialog_is_not_select}>
                                <span>Выберите диалог</span>
                                <img src={imgDialog} width={100} height={100} />
                            </div>
                        }
                    </div>

                    {/* ------- Поле ввода сообщения ------- */}
                    {this.props.currentUser.id !== 0 &&
                        <div className={styles.input_message_field}>
                            <TextareaAutosize maxRows={5} 
                                className={styles.text_field}
                                value={this.state.message}
                                onChange={this.writeMessage}
                            />
                            
                            <button className={styles.send_message_button} 
                                disabled={!this.state.message}
                                onClick={this.sendMessage}
                            >
                                <Icon img="send_message" size="large" />
                            </button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Messages;
