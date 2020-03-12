import React from 'react';
import styles from './DialogList.css';

import { Scrollbars } from 'react-custom-scrollbars';
import ScrollbarThumbVertical from '../../components/ScrollbarThumb/ScrollbarThumbVertical';

import Dialog from './Dialog';

import AppStateType from '../../types/AppStateType';
import DialogsType from '../../types/DialogsType';

interface PropsType {
    appState: AppStateType,
    messages: DialogsType,
    setDialogList: any,
    setDialogUser: any,
    setDialogMessages: any,
    dialogReset: any
}

interface StateType {

}

class DialogList extends React.Component <PropsType, StateType> {
    async componentDidMount() {
        await this.createDialogList();
    }

    componentWillUnmount() {
        this.props.dialogReset();
    }

    createDialogList = async () => {
        const res = await fetch('/api/users/login-as', { method: "POST" });
        const user = await res.json();

        this.setState({ userId: user.id });

        const resDialogIdArray = await fetch(`/api/messages/get_dialog_list/${user.id}`);
        const dialogIdArray = await resDialogIdArray.json();
        const dialogUsers: any[] = [];

        for (let id of dialogIdArray) {
            if (id !== user.id) {
                const resDialog = await fetch(`/api/users/get_by_id/${id}`);
                const dialog = await resDialog.json();
                
                dialogUsers.push(dialog);
            }
        }

        this.props.setDialogList(dialogUsers);

        if (
            !this.props.messages.dialogList.some(dialog => {
                return dialog.id === this.props.messages.selectedDialogUser.id
            }) && this.props.messages.selectedDialogUser.id
        ) {
            this.props.setDialogList([...dialogUsers, this.props.messages.selectedDialogUser]);
        };
    }

    selectDialog = async (index: string) => {
        await this.props.setDialogUser(this.props.messages.dialogList[parseInt(index)]);
        this.updateMessageList();
    }

    updateMessageList = async () => {
        const resUser = await fetch('/api/users/login-as', { method: "POST" });
        const user = await resUser.json();

        const resMessages = await fetch('/api/messages/get_dialog_messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: user.id,
                targetId: this.props.messages.selectedDialogUser.id
            })
        });
        let messages = await resMessages.json();
        
        this.props.setDialogMessages(messages);
    }

    render() {
        return (
            <div className={styles.DialogList}>
                {/* ------- Заголовок ------- */}
                <div className={styles.header}
                    onClick={this.props.dialogReset}
                >
                    Диалоги
                </div>

                {/* ------- Список дилогов ------- */}
                <Scrollbars autoHide
                    renderThumbVertical={ScrollbarThumbVertical}
                >
                    <div className={styles.dialog_list}>
                        {this.props.messages.dialogList.length 
                            ? this.props.messages.dialogList.map((user, index) => {
                                return (
                                    <Dialog key={user.id}
                                        id={`${index}`}
                                        avatar={'/api/avatars/' + user.avatar} 
                                        name={user.name}
                                        status={user.status}
                                        onClick={(e: any) => this.selectDialog(e.currentTarget.id)}
                                    />
                                )
                            }) 
                            : ""
                        }
                    </div>
                </Scrollbars>
            </div>
        )
    }
}

export default DialogList;
