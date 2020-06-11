import React from 'react';
import styles from './styles/Messages.m.css';
import classNames from 'classnames';

import Message from './Message';
import Conversation from './Conversation';
import InputMessageField from './InputMessageField';
import User from './User';
import { User as UserType, Message as MessageType, Conversation as ConversationType } from '../../store/Messages/types';
import { DateFromTimestamp } from '../../middleware';

import {
    Backdrop,
    Button,
    Checkbox,
    DropdownMenu,
    Icon,
    IconButton,
    Loading,
    LoadingError,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow
} from '../../shared';
import imgDialog from '../../assets/images/dialog.png';

interface Props {
    userId: number,
    isLoading: boolean,
    error: string,
    conversations: ConversationType[],
    messageList: MessageType[],
    friendList: UserType[],
    currentConversation: ConversationType | null,
    messagesSocket: WebSocket,
    addMessageInList: (message: MessageType) => void,
    updateConversationList: () => void,
    selectConversation: (conversation: ConversationType) => void,
    setFriendList: () => void,
    clearFriendList: () => void,
    addParticipants: (conversationId: number, userIds: { id: number }[]) => void,
    deleteParticipant: (conversationId: number, userId: number) => void,
    resetCurrentConversation: () => void,
    resetState: () => void
}

class Messages extends React.Component<Props> {
    messageContainer: React.RefObject<HTMLDivElement> = React.createRef();
    state = {
        message: "",
        addUsersToChat: {
            window: false,
            users: new Set()
        }
    };

    componentDidMount() {
        this.props.updateConversationList();
        this.props.messagesSocket.addEventListener('message', (e) => {
            let message = JSON.parse(e.data);

            if (this.props.currentConversation) {
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
        if (!this.props.currentConversation) return;

        this.props.messagesSocket.send(JSON.stringify({
            conversationId: this.props.currentConversation.id,
            text: this.state.message
        }));
        this.setState({ message: "" });
    }

    openAddUsersToChatWindow = () => {
        this.setState({ 
            addUsersToChat: {
                ...this.state.addUsersToChat,
                window: true
            }
        });
        this.props.setFriendList();
    }

    closeAddUsersToChatWindow = () => {
        this.setState({ 
            addUsersToChat: {
                ...this.state.addUsersToChat,
                window: false
            }
        });
        this.props.clearFriendList();
    }

    addOrRemoveUser = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        let { users } = this.state.addUsersToChat;

        switch(e.target.checked) {
            case true:
                users.add(id);
                break;

            case false:
                users.delete(id);
                break;
        }

        this.setState({
            addUsersToChat: {
                ...this.state.addUsersToChat,
                users
            }
        });
    }

    addUsersToChat = () => {
        const users: { id: number }[] = [];

        for (let id of this.state.addUsersToChat.users) {
            users.push({ id: id as number });
        }

        if (this.props.currentConversation) {
            this.props.addParticipants(this.props.currentConversation.id, users);
        }
    }

    deleteParticipant = (userId: number, event: React.MouseEvent) => {
        event.stopPropagation();

        if (!this.props.currentConversation) {
            return;
        }

        this.props.deleteParticipant(this.props.currentConversation.id, userId);
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
                    <div className={classNames(styles.header, styles.header_conversations)}
                        onClick={this.props.resetCurrentConversation}
                    >
                        <p className={styles.text}>
                            Беседы
                        </p>
                    </div>

                    {/* ------- Список бесед ------- */}
                    <div className={styles.dialog_list}>
                        {this.props.conversations.map(conversation => (
                            <Conversation key={conversation.id}
                                id={conversation.id}
                                creatorId={conversation.creatorId}
                                isDialog={conversation.isDialog}
                                name={conversation.name}
                                timestamp={conversation.timestamp}
                                participants={conversation.participants}
                                lastMessage={conversation.lastMessage}
                                onClick={() => this.props.selectConversation(conversation)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.content_column}>
                    {/* ------- Заголовок ------- */}
                    <div className={styles.header}>
                        {!this.props.currentConversation &&
                            <p className={styles.text}>
                                Сообщения
                            </p>
                        }

                        {/* ------ Название диалога ------ */}
                        {this.props.currentConversation && this.props.currentConversation.isDialog &&
                            <p className={styles.text}>
                                <span>{this.props.currentConversation.participants[0].firstName + " "}</span>
                                <span>{this.props.currentConversation.participants[0].lastName}</span>
                            </p>
                        }

                        {/* ------ Название чата ------ */}
                        {this.props.currentConversation && !this.props.currentConversation.isDialog &&
                            <p className={styles.text}>
                                {this.props.currentConversation.name}
                            </p>
                        }

                        {/* ------ Кнопки ------ */}
                        {this.props.currentConversation && !this.props.currentConversation.isDialog &&
                            <div>
                                <DropdownMenu arrow
                                    placement="right"
                                    control={
                                        <Button color="primary" variant="text" size="small">
                                            Участники
                                        </Button>
                                    }
                                >
                                    {this.props.currentConversation.participants.map(participant => (
                                        <User key={participant.id}
                                            id={participant.id}
                                            firstName={participant.firstName}
                                            lastName={participant.lastName}
                                            avatar={participant.avatar}
                                            actions={participant.id !== this.props.userId &&
                                                <IconButton size="very_small"
                                                    onClick={(e) => this.deleteParticipant(participant.id, e)}
                                                >
                                                    <Icon img="cross" size="very_small" color="gray" />
                                                </IconButton>
                                            }
                                        />
                                    ))}
                                </DropdownMenu>

                                <IconButton size="small"
                                    onClick={this.openAddUsersToChatWindow}
                                >
                                    <Icon img="plus" size="small" />
                                </IconButton>
                            </div>
                        }
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

                                    <Message isMy={message.author.id === this.props.userId}
                                        timestamp={date.getTime()}
                                        text={message.text}
                                    />
                                </React.Fragment>
                            )
                        })}

                        {!this.props.currentConversation &&
                            <div className={styles.dialog_is_not_select}>
                                <span>Выберите беседу</span>
                                <img src={imgDialog} width={100} height={100} />
                            </div>
                        }
                    </div>

                    {/* ------- Поле ввода сообщения ------- */}
                    {this.props.currentConversation &&
                        <InputMessageField value={this.state.message}
                            onChange={this.writeMessage} 
                            send={this.sendMessage}
                        />
                    }
                </div>

                <Backdrop blackout
                    isOpened={this.state.addUsersToChat.window}
                    onClose={this.closeAddUsersToChatWindow}
                >
                    <ModalWindow isOpened={this.state.addUsersToChat.window}>
                        <ModalHeader>
                            <span>Добавить собеседников</span>
                            <IconButton onClick={this.closeAddUsersToChatWindow}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody>
                            {this.props.friendList.map(friend => (
                                <User key={friend.id}
                                    id={friend.id}
                                    firstName={friend.firstName}
                                    lastName={friend.lastName}
                                    avatar={friend.avatar}
                                    selected={this.state.addUsersToChat.users.has(friend.id)}
                                    actions={
                                        <Checkbox
                                            onChange={(e) => this.addOrRemoveUser(e, friend.id)}
                                        />
                                    }
                                />
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
                                onClick={this.addUsersToChat}
                            >
                                Добавить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default Messages;
