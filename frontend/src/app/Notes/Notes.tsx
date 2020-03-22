import React from 'react';
import styles from './Notes.css';
import Note from './Note';

import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import DropdownContainer from '../../components/Dropdown/DropdownContainer';
import DropdownMenu from '../../components/Dropdown/DropdownMenu';
import DropdownItem from '../../components/Dropdown/DropdownItem';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import InputField from '../../components/InputField/InputField';
import TextArea from '../../components/TextArea/TextArea';

import iconPlusGray from '../../components/icons/icon_plus_gray.png';
import iconCrossWhite from '../../components/icons/icon_cross_white.png';
import iconEditGray from '../../components/icons/icon_edit_gray.png';

interface PropsType {
    showAlert: Function
}

interface StateType {
    notes: any[],
    addNewNoteWindow: boolean,
    newNoteHeader: string,
    newNoteContent: string,
    editMenu: string | null
}

class Notes extends React.Component <PropsType, StateType> {
    showAlert: Function;

    constructor(props: PropsType) {
        super(props);
        this.showAlert = this.props.showAlert;
        this.state = {
            notes: [],
            addNewNoteWindow: false,
            newNoteHeader: "",
            newNoteContent: "",
            editMenu: null
        };
    }

    async componentDidMount() {
        this.updateNoteList();
    }

    updateNoteList = async () => {
        const resUser = await fetch('/api/users/login-as', { method: "POST" });
        const user = await resUser.json();
        const resNotes = await fetch(`/api/notes/${user.id}`);
        const notes = await resNotes.json();

        this.setState({ notes });
    }

    openNewNoteWindow = () => {
        this.setState({ addNewNoteWindow: true });
    }

    closeNewNoteWindow = () => {
        this.setState({ 
            addNewNoteWindow: false, 
            newNoteHeader: "", 
            newNoteContent: "" 
        });
    }

    setEditMenu = (value: string | null) => {
        this.setState({ editMenu: this.state.editMenu === null ? value : null });
    }

    addNewNote = async () => {
        if (this.state.newNoteHeader && this.state.newNoteContent) {
            const resUser = await fetch('/api/users/login-as', { method: "POST" });
            const user = await resUser.json();

            await fetch(`/api/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charser=utf-8"
                },
                body: JSON.stringify({
                    userId: user.id,
                    header: this.state.newNoteHeader,
                    content: this.state.newNoteContent
                })
            });
            
            this.setState({ newNoteHeader: "", newNoteContent: "" });
            this.updateNoteList();
            this.closeNewNoteWindow();
        } else {
            this.showAlert("warning", "Введите название и текст заметки");
        }
    }

    render() {
        return (
            <div className={styles.Notes}>
                <div className={styles.container}>
                    {this.state.notes.map(item => (
                        <Note 
                            key={item.id}
                            header={item.header}
                            content={item.content}
                            editMenu={
                                <DropdownContainer>
                                    <IconButton
                                        size="very_small" 
                                        onClick={() => this.setEditMenu(item.id)}
                                    >
                                        <img src={iconEditGray} width={10} height={10} />
                                    </IconButton>
                                    <DropdownMenu placement="right"
                                        open={this.state.editMenu === item.id} 
                                        arrow={{ right: 4 }}
                                        onClose={() => this.setEditMenu(null)}
                                    >
                                        <DropdownItem>
                                            Редактировать
                                        </DropdownItem>

                                        <DropdownItem>
                                            Удалить
                                        </DropdownItem>
                                    </DropdownMenu>
                                </DropdownContainer>
                            }
                        />
                    ))}

                    <Note plus>
                        <IconButton size="very_large"
                            onClick={this.openNewNoteWindow}
                        >
                            <img src={iconPlusGray} width={48} height={48} />
                        </IconButton>
                    </Note>
                </div>

                <Backdrop 
                    blackout
                    isOpened={this.state.addNewNoteWindow}
                    onClose={this.closeNewNoteWindow}
                >
                    <ModalWindow>
                        <ModalHeader color="primary">
                            <span>Новая заметка</span>
                            <IconButton size="medium"
                                onClick={this.closeNewNoteWindow}
                            >
                                <img src={iconCrossWhite} width={18} height={18} />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField 
                                label="Заголовок"
                                value={this.state.newNoteHeader}
                                onChange={(e: any) => {
                                    this.setState({ newNoteHeader: e.target.value });
                                }}
                            />

                            <TextArea rows={3}
                                label="Текст"
                                style={{ margin: "30px 0 8px 0" }}
                                value={this.state.newNoteContent}
                                onChange={(e: any) => {
                                    this.setState({ newNoteContent: e.target.value });
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.addNewNote}>
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default Notes;