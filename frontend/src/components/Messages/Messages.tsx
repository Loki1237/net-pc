import React from 'react';
import styles from './styles/Messages.m.css';

import Message from './Message';
import Dialog from './Dialog';
import InputMessageField from './InputMessageField';
import { User as UserType, Message as MessageType } from '../../store/Messages/types';
import { DateFromTimestamp } from '../../middleware';
import { toast as notify } from 'react-toastify';

import { Loading, LoadingError } from '../../shared';
import imgDialog from '../../assets/images/dialog.png';

interface Props {
    userId: number,
    isLoading: boolean,
    error: string,
    userList: UserType[],
    messageList: MessageType[],
    currentUser: UserType,
    messagesSocket: WebSocket,
    addMessageInList: (message: MessageType) => void,
    updateUserList: () => void,
    selectDialog: (user: UserType) => void,
    sendMessage: (targetId: number, content: string) => void,
    resetCurrentUser: () => void,
    resetState: () => void
}

class Messages extends React.Component<Props> {
    messageContainer: React.RefObject<HTMLDivElement> = React.createRef();
    state = {
        message: "",
    };

    componentDidMount() {
        this.props.updateUserList();
        this.props.messagesSocket.addEventListener('message', (e) => {
            let message = JSON.parse(e.data);

            if (this.props.currentUser.id) {
                this.props.addMessageInList(message);
            }
        });
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.messageList.length !== prevProps.messageList.length) {
            this.messageContainer.current?.scrollTo(0, this.messageContainer.current?.scrollHeight);
        }
    }

    writeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ message: e.target.value });
    }

    sendMessage = () => {
        this.props.messagesSocket.send(JSON.stringify({
            targetId: this.props.currentUser.id,
            content: this.state.message
        }));
        this.setState({ message: "" });
    }

    renderLoading = () => (
        <div className={styles.Messages}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Messages}>
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

                    {/* ------- Контейнер сообщений ------- */}
                    <div className={styles.message_container} ref={this.messageContainer}>
                        {this.props.messageList.map((message, i, array) => {
                            const date = new DateFromTimestamp(message.timestamp);
                            let match = false;

                            if (i > 0) {
                                const dateOfPrevMessage = new DateFromTimestamp(array[i - 1].timestamp);
                                match = date.getNumber() === dateOfPrevMessage.getNumber();
                            }

                            return (
                                <React.Fragment key={message.id}>
                                    {!match && <div className={styles.date_divider}>
                                        <span>{date.getDate()}</span>
                                    </div>}

                                    <Message my={message.userId === this.props.userId}
                                        timestamp={date.getTime()}
                                        content={message.content}
                                    />
                                </React.Fragment>
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
                        <InputMessageField value={this.state.message}
                            onChange={this.writeMessage} 
                            send={this.sendMessage}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Messages;
