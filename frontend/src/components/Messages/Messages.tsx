import React from 'react';
import styles from './styles/Messages.m.css';

import Message from './Message';
import Dialog from './Dialog';

import { IconButton } from '../../shared';
import TextareaAutosize from 'react-textarea-autosize';

import imgDialog from '../../images/dialog.png';
import iconSendMessage from '../../shared/icons/icon_send_message.png';

interface MessageType {
    id: number,
    userId: number,
    targetId: number,
    content: string,
    timestamp: string
}

interface DialogUser {
    id: number,
    name: string,
    country: string,
    city: string,
    avatar: string
    status: string
}

interface Props {
    userId: number
}

interface State {
    enteringMessage: string,
    dialogList: DialogUser[],
    selectedUserForDialog: DialogUser,
    messages: MessageType[]
}

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
]

const emptySelectedUser = {
    id: 0,
    name: "",
    country: "",
    city: "",
    avatar: "",
    status: ""
}

class Messages extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            enteringMessage: "",
            dialogList: [],
            selectedUserForDialog: emptySelectedUser,
            messages: []
        };
    }

    async componentDidMount() {
        this.createDialogList();
    }

    componentWillUnmount() {
        this.dialogReset();
    }

    createDialogList = async () => {
        const resDialogIdArray = await fetch(`/api/messages/get_dialog_list/${this.props.userId}`);

        if (resDialogIdArray.status !== 200) {
            console.log(resDialogIdArray);
            return;
        }

        const dialogIdArray = await resDialogIdArray.json();
        const dialogUsers: DialogUser[] = [];

        for (let id of dialogIdArray) {
            if (id !== this.props.userId) {
                const resDialog = await fetch(`/api/users/get_by_id/${id}`);
                const dialog = await resDialog.json();
                
                dialogUsers.push(dialog);
            }
        }

        this.setState({ dialogList: dialogUsers });
    }

    selectDialog = (e: React.MouseEvent<HTMLDivElement>): void => {
        const index = e.currentTarget.id;
        this.setState({ selectedUserForDialog: this.state.dialogList[+index] });
        this.updateMessageList();
    }

    updateMessageList = async () => {
        const resMessages = await fetch('/api/messages/get_dialog_messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: this.props.userId,
                targetId: this.state.selectedUserForDialog.id
            })
        });
        let messages = await resMessages.json();
        
        this.setState({ messages });
    }

    dialogReset = () => {
        this.setState({ selectedUserForDialog: emptySelectedUser, messages: [] });
    }

    writeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ enteringMessage: e.target.value });
    }

    sendMessage = async () => {
        await fetch('/api/messages/send', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: this.props.userId,
                targetId: this.state.selectedUserForDialog.id,
                content: this.state.enteringMessage
            })
        });
        this.setState({ enteringMessage: "" });
        this.updateMessageList();
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

    render() {
        return (
            <div className={styles.Messages}>
                <div className={styles.dialog_column}>
                    {/* ------- Заголовок ------- */}
                    <div className={styles.header}
                        onClick={this.dialogReset}
                    >
                        Диалоги
                    </div>

                    {/* ------- Список дилогов ------- */}
                    <div className={styles.dialog_list}>
                        {this.state.dialogList.map((user, index) => {
                            return (
                                <Dialog key={user.id}
                                    id={`${index}`}
                                    avatar={user.avatar} 
                                    name={user.name}
                                    status={user.status}
                                    onClick={this.selectDialog}
                                />
                            )
                        })}
                    </div>
                </div>

                <div className={styles.content_column}>
                    {/* ------- Заголовок ------- */}
                    <div className={styles.message_container_header}>
                        {this.state.selectedUserForDialog.name || "Сообщения"}
                    </div>

                    {/* ------- Контейнер сообщения ------- */}
                    <div className={styles.message_container}>
                        {this.state.messages.map(message => {
                            const timestamp = this.setTimestamp(message.timestamp);

                            return (
                                <Message key={message.id}
                                    userId={message.userId}
                                    my={message.userId === this.props.userId}
                                    timestamp={timestamp}
                                >
                                    {message.content}
                                </Message>
                            )
                        })}

                        {!this.state.selectedUserForDialog.id 
                            ? <div className={styles.dialog_is_not_select}>
                                <span>Выберите диалог</span>
                                <img src={imgDialog} width={100} height={100} />
                            </div>
                            : ""
                        }
                    </div>

                    {/* ------- Поле ввода сообщения ------- */}
                    {this.state.selectedUserForDialog.id 
                        ? <div className={styles.input_message_field}>
                            <TextareaAutosize maxRows={5} 
                                className={styles.text_field}
                                value={this.state.enteringMessage}
                                onChange={this.writeMessage}
                            />
                            
                            <IconButton 
                                disabled={!this.state.enteringMessage}
                                onClick={this.sendMessage}
                            >
                                <img src={iconSendMessage} width={22} height={22} />
                            </IconButton>
                        </div>
                        : ""
                    }
                </div>
            </div>
        );
    }
}

export default Messages;
