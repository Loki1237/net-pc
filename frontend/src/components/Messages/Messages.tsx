import React from 'react';
import styles from './styles/Messages.m.css';

import { getMyId } from '../../middleware';

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

interface PropsType {
    
}

interface StateType {
    userId: number | null,
    enteringMessage: string,
    dialogList: any[],
    selectedDialogUser: any,
    messages: MessageType[]
}

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
]

class Messages extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            userId: null,
            enteringMessage: "",
            dialogList: [],
            selectedDialogUser: {},
            messages: []
        };
    }

    async componentDidMount() {
        const myId = await getMyId();
        this.setState({ userId: myId });
        this.createDialogList();
    }

    componentWillUnmount() {
        this.dialogReset();
    }

    createDialogList = async () => {
        const myId = await getMyId();

        this.setState({ userId: myId });

        const resDialogIdArray = await fetch(`/api/messages/get_dialog_list/${myId}`);

        if (resDialogIdArray.status !== 200) {
            console.log(resDialogIdArray);
            return;
        }

        const dialogIdArray = await resDialogIdArray.json();
        const dialogUsers: any[] = [];

        for (let id of dialogIdArray) {
            if (id !== myId) {
                const resDialog = await fetch(`/api/users/get_by_id/${id}`);
                const dialog = await resDialog.json();
                
                dialogUsers.push(dialog);
            }
        }

        this.setState({ dialogList: dialogUsers });
    }

    selectDialog = (index: string) => {
        this.setState({ selectedDialogUser: this.state.dialogList[+index] });
        this.updateMessageList();
    }

    updateMessageList = async () => {
        const myId = await getMyId();

        const resMessages = await fetch('/api/messages/get_dialog_messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: myId,
                targetId: this.state.selectedDialogUser.id
            })
        });
        let messages = await resMessages.json();
        
        this.setState({ messages });
    }

    dialogReset = () => {
        this.setState({ selectedDialogUser: {}, messages: [] });
    }

    sendMessage = async () => {
        const myId = await getMyId();

        await fetch('/api/messages/send', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: myId,
                targetId: this.state.selectedDialogUser.id,
                content: this.state.enteringMessage
            })
        });
        this.setState({ enteringMessage: "" });
        this.updateMessageList();
    }

    setTimestamp = (miliseconds: string) => {
        const date = new Date(parseInt(miliseconds));

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
                                    avatar={'/api/avatars/' + user.avatar} 
                                    name={user.name}
                                    status={user.status}
                                    onClick={(e: any) => this.selectDialog(e.currentTarget.id)}
                                />
                            )
                        })}
                    </div>
                </div>

                <div className={styles.content_column}>
                    {/* ------- Заголовок ------- */}
                    <div className={styles.message_container_header}>
                        {this.state.selectedDialogUser.name || "Сообщения"}
                    </div>

                    {/* ------- Контейнер сообщения ------- */}
                    <div className={styles.message_container}>
                        {this.state.messages.map(message => {
                            const timestamp = this.setTimestamp(message.timestamp);

                            return (
                                <Message key={message.id}
                                    userId={message.userId}
                                    my={message.userId === this.state.userId}
                                    timestamp={timestamp}
                                >
                                    {message.content}
                                </Message>
                            )
                        })}

                        {!this.state.selectedDialogUser.id 
                            ? <div className={styles.dialog_is_not_select}>
                                <span>Выберите диалог</span>
                                <img src={imgDialog} width={100} height={100} />
                            </div>
                            : ""
                        }
                    </div>

                    {/* ------- Поле ввода сообщения ------- */}
                    {this.state.selectedDialogUser.id 
                        ? <div className={styles.input_message_field}>
                            <TextareaAutosize maxRows={5} 
                                className={styles.text_field}
                                value={this.state.enteringMessage}
                                onChange={(e: any) => this.setState({ enteringMessage: e.target.value })}
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
