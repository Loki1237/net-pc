import React from 'react';
import styles from './Styles.m.css';
import Note from './Note';

import { getMyId } from '../middleware';
import { toast as notify } from 'react-toastify';

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
    
}

interface StateType {
    notes: any[],
    addNewNoteWindow: boolean,
    newNoteHeader: string,
    newNoteContent: string
}

class Notes extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            notes: [],
            addNewNoteWindow: false,
            newNoteHeader: "",
            newNoteContent: ""
        };
    }

    async componentDidMount() {
        this.updateNoteList();
    }

    updateNoteList = async () => {
        const myId = await getMyId();

        const resNotes = await fetch(`/api/notes/${myId}`);
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

    addNewNote = async () => {
        if (!this.state.newNoteHeader || !this.state.newNoteContent) {
            notify.warn("Введите название и текст заметки");
            return;
        }

        const myId = await getMyId();

        await fetch(`/api/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                userId: myId,
                header: this.state.newNoteHeader,
                content: this.state.newNoteContent
            })
        });
        
        this.setState({ newNoteHeader: "", newNoteContent: "" });
        this.updateNoteList();
        this.closeNewNoteWindow();
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
                                    <IconButton size="very_small">
                                        <img src={iconEditGray} width={10} height={10} />
                                    </IconButton>
                                    <DropdownMenu placement="right"
                                        arrow={{ right: 4 }}
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
