import React from 'react';
import styles from './Styles.m.css';
import Note from './Note';

import { getMyId } from '../middleware';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

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
import Divider from '../../components/Divider/Divider';

import iconCrossWhite from '../../components/icons/icon_cross_white.png';
import iconEditGray from '../../components/icons/icon_edit_gray.png';

interface PropsType {
    
}

interface StateType {
    notes: any[],
    newNote: {
        window: boolean,
        header: string,
        content: string
    },
    wideScreenNote: {
        window: boolean,
        header: string,
        content: string,
        id: number | null,
        mode: string
    }
}

class Notes extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            notes: [],
            newNote: {
                window: false,
                header: "",
                content: ""
            },
            wideScreenNote: {
                window: false,
                header: "",
                content: "",
                id: null,
                mode: "read"
            }
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

    setNewNoteWindow = (value: boolean) => {
        this.setState({ 
            newNote: {
                window: value,
                header: "",
                content: ""
            }
        });
    }

    setWideScreenNoteWindow = (value: boolean, id?: number) => {
        const notes = this.state.notes;
        const i = _.findIndex(notes, { id });

        this.setState({
            wideScreenNote: {
                window: value,
                header: i >= 0 ? notes[i].header : "",
                content: i >= 0 ? notes[i].content : "",
                id: id || null,
                mode: "read"
            }
        });
    }

    saveNewNote = async () => {
        if (!this.state.newNote.header || !this.state.newNote.content) {
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
                header: this.state.newNote.header,
                content: this.state.newNote.content
            })
        });
        
        this.updateNoteList();
        this.setNewNoteWindow(false);
    }
    
    saveChangedNote = async () => {
        if (!this.state.wideScreenNote.header || !this.state.wideScreenNote.content) {
            notify.warn("Введите название и текст заметки");
            return;
        }

        const changedNote = this.state.wideScreenNote;

        await fetch(`/api/notes/${changedNote.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                header: changedNote.header,
                content: changedNote.content
            })
        });
        
        this.updateNoteList();
        this.setWideScreenNoteWindow(false)
    }

    deleteNote = async (id: number) => {
        await fetch('api/notes', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ id })
        });

        this.updateNoteList();
    }

    render() {
        return (
            <div className={styles.Notes}>
                <div className={styles.container}>
                    {this.state.notes.map(note => (
                        <Note 
                            key={note.id}
                            header={note.header}
                            content={note.content}
                            editMenu={
                                <DropdownContainer>
                                    <IconButton size="very_small">
                                        <img src={iconEditGray} width={10} height={10} />
                                    </IconButton>
                                    <DropdownMenu placement="right"
                                        arrow={{ right: 4 }}
                                    >
                                        <DropdownItem onClick={() => {
                                            this.setWideScreenNoteWindow(true, note.id)
                                        }}>
                                            Открыть
                                        </DropdownItem>

                                        <DropdownItem onClick={() => this.deleteNote(note.id)}>
                                            Удалить
                                        </DropdownItem>
                                    </DropdownMenu>
                                </DropdownContainer>
                            }
                        />
                    ))}

                    <Note plus onClick={() => this.setNewNoteWindow(true)} />
                </div>

                {/* ========== Модалка: новая заметка ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.newNote.window}
                    onClose={() => this.setNewNoteWindow(false)}
                >
                    <ModalWindow>
                        <ModalHeader color="primary">
                            <span>Новая заметка</span>
                            <IconButton size="medium"
                                onClick={() => this.setNewNoteWindow(false)}
                            >
                                <img src={iconCrossWhite} width={18} height={18} />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField
                                label="Заголовок"
                                labelPlacement="top"
                                value={this.state.newNote.header}
                                onChange={(e: any) => {
                                    this.setState({ newNote: { 
                                        ...this.state.newNote, 
                                        header: e.target.value 
                                    } });
                                }}
                            />

                            <Divider spaceY={8} bg="transparent" />

                            <TextArea minRows={5} maxRows={5}
                                label="Текст"
                                value={this.state.newNote.content}
                                onChange={(e: any) => {
                                    this.setState({ newNote: { 
                                        ...this.state.newNote, 
                                        content: e.target.value 
                                    } });
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.saveNewNote}>
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

                {/* ========== Модалка: открытая заметка ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.wideScreenNote.window}
                    onClose={() => this.setWideScreenNoteWindow(false)}
                >
                    <ModalWindow>
                        {this.state.wideScreenNote.mode === "update" &&
                            <ModalHeader>
                                Редактировать
                            </ModalHeader>
                        }
                        <ModalBody align="left">
                            {this.state.wideScreenNote.mode === "read" &&
                                <div>
                                    <header>{this.state.wideScreenNote.header}</header>
                                    <span>{this.state.wideScreenNote.content}</span>
                                </div>
                            }

                            {this.state.wideScreenNote.mode === "update" &&
                                <div>
                                    <InputField 
                                        label="Заголовок"
                                        labelPlacement="top"
                                        value={this.state.wideScreenNote.header}
                                        onChange={(e: any) => {
                                            this.setState({ wideScreenNote: { 
                                                ...this.state.wideScreenNote, 
                                                header: e.target.value 
                                            } });
                                        }}
                                    />

                                    <Divider spaceY={8} bg="transparent" />

                                    <TextArea minRows={5} maxRows={5}
                                        label="Текст"
                                        value={this.state.wideScreenNote.content}
                                        onChange={(e: any) => {
                                            this.setState({ wideScreenNote: { 
                                                ...this.state.wideScreenNote, 
                                                content: e.target.value 
                                            } });
                                        }}
                                    />
                                </div>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary"  style={{ marginRight: 20 }}
                                onClick={() => {
                                    this.setWideScreenNoteWindow(false)
                                }}
                            >
                                Закрыть
                            </Button>

                            {this.state.wideScreenNote.mode === "read" &&
                                <Button color="primary" onClick={() => {
                                    this.setState({ wideScreenNote: {
                                        ...this.state.wideScreenNote,
                                        mode: "update"
                                    } })
                                }}>
                                    Редактировать
                                </Button>
                            }

                            {this.state.wideScreenNote.mode === "update" &&
                                <Button color="primary" onClick={this.saveChangedNote}>
                                    Сохранить
                                </Button>
                            }
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default Notes;
