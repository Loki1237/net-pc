import React from 'react';
import styles from './Notes.css';
import Note from './Note';

import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import InputField from '../../components/InputField/InputField';
import TextArea from '../../components/TextArea/TextArea';

interface Props {
    
}

interface State {
    notes: any[],
    addNewNoteWindow: boolean,
    newNoteHeader: string,
    newNoteContent: string
}

class Notes extends React.Component <Props, State> {
    constructor(props: any) {
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
        }
    }

    render() {
        return (
            <div className={styles.Notes}>
                <h2>My notes</h2>

                <div className={styles.container}>
                    {this.state.notes.map(item => (
                        <Note 
                            key={item.id}
                            header={item.header}
                            content={item.content}
                        />
                    ))}

                    <Note plus >
                        <IconButton plus onClick={this.openNewNoteWindow}/>
                    </Note>
                </div>

                <Backdrop 
                    isOpened={this.state.addNewNoteWindow}
                    onClose={this.closeNewNoteWindow}
                >
                    <ModalWindow>
                        <ModalHeader color="primary">New note</ModalHeader>
                        <ModalBody align="center">
                            <InputField 
                                name="Заголовок"
                                value={this.state.newNoteHeader}
                                onChange={(e: any) => {
                                    this.setState({ newNoteHeader: e.target.value });
                                }}
                            />

                            <TextArea rows={3}
                                name="Текст"
                                value={this.state.newNoteContent}
                                onChange={(e: any) => {
                                    this.setState({ newNoteContent: e.target.value });
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.addNewNote}>Add</Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default Notes;
