import React from 'react';
import styles from './styles/Messages.m.css';
import { Scrollbars } from 'react-custom-scrollbars';

import { getMyId } from '../middleware';

import Message from './Message';

import IconButton from '../../components/IconButton/IconButton';
import TextareaAutosize from 'react-textarea-autosize';

import imgDialog from '../../images/dialog.png';
import iconSendMessage from '../../components/icons/icon_send_message.png';

import DialogsType from '../../types/DialogsType';

interface PropsType {
    messages: DialogsType,
    setDialogList: any,
    setDialogUser: any,
    setDialogMessages: any,
    dialogReset: any
}

interface StateType {
    userId: number | null,
    enteringMessage: string
}

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
]

class Messages extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            userId: null,
            enteringMessage: ""
        };
    }

    async componentDidMount() {
        const myId = await getMyId();
        this.setState({ userId: myId });
    }

    componentWillUnmount() {
        this.props.dialogReset();
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
                targetId: this.props.messages.selectedDialogUser.id
            })
        });
        let messages = await resMessages.json();
        
        this.props.setDialogMessages(messages);
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
                targetId: this.props.messages.selectedDialogUser.id,
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

                    {/* ------- Заголовок ------- */}
                    <div className={styles.message_container_header}>
                        {this.props.messages.selectedDialogUser.name || "Сообщения"}
                    </div>

                    {/* ------- Контейнер сообщения ------- */}
                    <div className={styles.message_container}>
                        {this.props.messages.selectedDialogMessages.length 
                            ? this.props.messages.selectedDialogMessages.map(message => {
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
                            }) 
                            : ""
                        }
                    </div>

                    {!this.props.messages.selectedDialogUser.id 
                        ? <div className={styles.dialog_is_not_select}>
                            <span>Выберите диалог</span>
                            <img src={imgDialog} width={100} height={100} />
                        </div>
                        : ""
                    }

                    {/* ------- Поле ввода сообщения ------- */}
                    {this.props.messages.selectedDialogUser.id 
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
        );
    }
}

export default Messages;
