import React from 'react';
import styles from './Styles.m.css';
import Note from './Note';

import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import {
    Backdrop,
    Button,
    Divider,
    Icon,
    IconButton,
    InputField,
    Loading,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    TextArea
} from '../../shared';

interface Props {
    userId: number
}

interface State {
    notes: NoteType[],
    note: {
        window: boolean,
        windowHeader: string,
        header: string,
        content: string,
        id: number,
        mode: string
    }
}

interface NoteType {
    id: number,
    userId: number,
    header: string,
    content: string
}

class Notes extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notes: [],
            note: {
                window: false,
                windowHeader: "",
                header: "",
                content: "",
                id: 0,
                mode: "new" // new || read || edit
            }
        };
    }

    async componentDidMount() {
        this.updateNoteList();
    }

    updateNoteList = async () => {
        const resNotes = await fetch(`/api/notes/${this.props.userId}`);
        const notes: NoteType[] = await resNotes.json();

        this.setState({ notes });
    }

    setNoteWindow = (value: boolean, mode?: string, id?: number) => {
        const notes = this.state.notes;
        const i = id ? _.findIndex(notes, { id }) : 0;

        const readOrEditMode = mode ? /^(read|edit)$/.test(mode) : false;
        const windowHeaders: any = {
            new: "Новая заметка",
            read: "Заметка",
            edit: "Редактировать"
        }

        this.setState({
            note: {
                window: value,
                windowHeader: mode ? windowHeaders[mode] : this.state.note.windowHeader,
                header: readOrEditMode ? notes[i].header : mode === "new" ? "" : this.state.note.header,
                content: readOrEditMode ? notes[i].content : mode === "new" ? "" : this.state.note.content,
                id: id ? id : 0,
                mode: mode ? mode : this.state.note.mode
            }
        });
    }

    editNote = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({ note: { 
            ...this.state.note, 
            [e.target.name]: e.target.value 
        } });
    }

    saveNote = async () => {
        if (!this.state.note.header || !this.state.note.content) {
            notify.warn("Введите название и текст заметки");
            return;
        }

        switch(this.state.note.mode) {
            case "new":
                await fetch(`/api/notes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charser=utf-8"
                    },
                    body: JSON.stringify({
                        userId: this.props.userId,
                        header: this.state.note.header,
                        content: this.state.note.content
                    })
                });
                break;

            case "edit":
                await fetch(`/api/notes/${this.state.note.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json;charser=utf-8"
                    },
                    body: JSON.stringify({
                        header: this.state.note.header,
                        content: this.state.note.content
                    })
                });
                break;
        }

        this.updateNoteList();
        this.setNoteWindow(false)
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
                            open={() => this.setNoteWindow(true, "read", note.id)}
                            delete={() => this.deleteNote(note.id)}
                        />
                    ))}

                    <Note type="new" onClick={() => this.setNoteWindow(true, "new")} />
                </div>

                {/* ========== Модалка: заметка (новая, читать, редактировать) ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.note.window}
                    onClose={() => this.setNoteWindow(false)}
                >
                    <ModalWindow isOpened={this.state.note.window}>
                        <ModalHeader>
                            <span>{this.state.note.windowHeader}</span>
                            <IconButton onClick={() => this.setNoteWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align={this.state.note.mode === "read" ? "left" : "center"}>
                            {this.state.note.mode === "read" && 
                                <header className={styles.modal_note_header}>
                                    {this.state.note.header}
                                </header>
                            }
                            {this.state.note.mode !== "read" && 
                                <InputField 
                                    label="Заголовок:"
                                    labelPlacement="top"
                                    name="header"
                                    value={this.state.note.header}
                                    onChange={this.editNote}
                                />
                            }

                            {this.state.note.mode === "read" && 
                                <span>{this.state.note.content}</span>
                            }
                            {this.state.note.mode !== "read" && 
                                <TextArea minRows={5} maxRows={5}
                                    label="Текст:"
                                    name="content"
                                    value={this.state.note.content}
                                    onChange={this.editNote}
                                />
                            }
                        </ModalBody>
                        <ModalFooter>
                            {this.state.note.mode === "edit" &&
                                <Button color="secondary" 
                                    style={{ marginRight: 20 }}
                                    onClick={() => this.setNoteWindow(true, "read", this.state.note.id)}
                                >
                                    Отмена
                                </Button>
                            }

                            {this.state.note.mode === "read" &&
                                <Button color="primary" 
                                    onClick={() => this.setNoteWindow(true, "edit", this.state.note.id)}
                                >
                                    Редактировать
                                </Button>
                            }

                            {this.state.note.mode !== "read" &&
                                <Button color="primary" 
                                    disabled={!this.state.note.header || !this.state.note.content}
                                    onClick={this.saveNote}
                                >
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
