import React from 'react';
import styles from './Styles.m.css';
import Note from './Note';
import { Note as NoteType } from '../../store/Notes/types';

import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import {
    Backdrop,
    Button,
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
    isLoading: boolean,
    hasErrored: boolean,
    noteList: NoteType[],
    updateNoteList: () => void,
    createNote: (header: string, content: string) => void,
    changeNote: (header: string, content: string, id: number) => void,
    deleteNote: (id: number) => void,
    resetState: () => void
}

interface State {
    note: {
        window: boolean,
        windowHeader: string,
        header: string,
        content: string,
        id: number,
        mode: string
    }
}

class Notes extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
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

    componentDidMount() {
        this.props.updateNoteList();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    openNoteModalWindow = (mode: string, id?: number) => {
        const notes = this.props.noteList;
        const i = id ? _.findIndex(notes, { id }) : 0;
        const currentNote = notes[i];

        if (mode !== "new" && mode !== "read" && mode !== "edit") {
            return;
        }

        const windowHeaders: any = {
            new: "Новая заметка",
            read: "Заметка",
            edit: "Редактировать"
        }

        this.setState({
            note: {
                window: true,
                windowHeader: windowHeaders[mode],
                header: mode === "new" ? "" : currentNote.header,
                content: mode === "new" ? "" : currentNote.content,
                id: id ? id : 0,
                mode
            }
        });
    }

    closeNoteModalWindow = () => {
        this.setState({ note: { ...this.state.note, id: 0, window: false } });
    }

    editNote = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({ note: { 
            ...this.state.note, 
            [e.target.name]: e.target.value 
        } });
    }

    saveNote = () => {
        const { header, content, id, mode } = this.state.note;

        if (!header || !content) {
            notify.warn("Введите название и текст заметки");
            return;
        }

        switch(mode) {
            case "new":
                this.props.createNote(header, content);
                break;

            case "edit":
                this.props.changeNote(header, content, id);
                break;
        }

        this.closeNoteModalWindow();
    }

    renderLoading = () => (
        <div className={styles.Notes}>
            <Loading />
        </div>
    )

    renderError = () => (
        <div className={styles.Notes}>
            <h1>Error</h1>
        </div>
    )

    render() {
        if (this.props.hasErrored) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.Notes}>
                <div className={styles.container}>
                    {this.props.noteList.map(note => (
                        <Note key={note.id}
                            header={note.header}
                            content={note.content}
                            open={() => this.openNoteModalWindow("read", note.id)}
                            delete={() => this.props.deleteNote(note.id)}
                        />
                    ))}

                    <Note type="new" onClick={() => this.openNoteModalWindow("new")} />
                </div>

                {/* ========== Модалка: заметка (новая, читать, редактировать) ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.note.window}
                    onClose={() => this.closeNoteModalWindow()}
                >
                    <ModalWindow isOpened={this.state.note.window}>
                        <ModalHeader>
                            <span>{this.state.note.windowHeader}</span>
                            <IconButton onClick={() => this.closeNoteModalWindow()}>
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
                                    onClick={() => this.openNoteModalWindow("read", this.state.note.id)}
                                >
                                    Отмена
                                </Button>
                            }

                            {this.state.note.mode === "read" &&
                                <Button color="primary" 
                                    onClick={() => this.openNoteModalWindow("edit", this.state.note.id)}
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
