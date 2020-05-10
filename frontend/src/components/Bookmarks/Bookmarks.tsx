import React from 'react';
import styles from './styles/Bookmarks.m.css';

import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import Bookmark from './Bookmark';

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
    ModalWindow
} from '../../shared';

interface Props {
    userId: number
}

interface State {
    bookmarkList: BookmarkType[],
    bookmark: {
        window: boolean,
        name: string,
        url: string,
        id?: number,
        mode: string
    }
}

interface BookmarkType {
    id: number,
    userId: number,
    name: string,
    url: string
}

class Bookmarks extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            bookmarkList: [],
            bookmark: {
                window: false,
                name: "",
                url: "",
                id: 0,
                mode: "new" // new || edit
            }
        };
    }

    async componentDidMount() {
        await this.updateBookamrkList();
    }

    updateBookamrkList = async () => {
        const resBookmarks = await fetch(`/api/bookmarks/${this.props.userId}`);
        const bookmarks: BookmarkType[] = await resBookmarks.json();

        this.setState({ bookmarkList: bookmarks });
    }

    setNewOrEditBookmarkWindow = (value: boolean, mode?: string, id?: number) => {
        const bookmarks = this.state.bookmarkList;
        const i = id ? _.findIndex(bookmarks, { id }) : 0;

        this.setState({
            bookmark: {
                window: value,
                name: mode === "edit" ? bookmarks[i].name : "",
                url: mode === "edit" ? bookmarks[i].url : "",
                id: id ? id : 0,
                mode: mode ? mode : this.state.bookmark.mode
            }
        });
    }

    saveBookmark = async () => {
        if (!this.state.bookmark.name || !this.state.bookmark.url) {
            notify.warn("Введите название и адрес закладки");
            return;
        }

        switch(this.state.bookmark.mode) {
            case "new":
                await fetch('/api/bookmarks', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body: JSON.stringify({
                        userId: this.props.userId,
                        name: this.state.bookmark.name,
                        url: this.state.bookmark.url
                    })
                });
                break;

            case "edit":
                await fetch(`/api/bookmarks/${this.state.bookmark.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: this.state.bookmark.name,
                        url: this.state.bookmark.url
                    })
                });
                break;
        }
        
        this.updateBookamrkList();
        this.setNewOrEditBookmarkWindow(false);
    }

    deleteBookmark = async (id: number) => {
        await fetch('/api/bookmarks', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ id })
        });

        this.updateBookamrkList();
    }

    editBookmark = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ bookmark: {
            ...this.state.bookmark,
            [e.target.name]: e.target.value
        }});
    }

    render() {
        return (
            <div className={styles.Bookmarks}>
                <div className={styles.bookmarks_container}>
                    {this.state.bookmarkList.map(bookmark => {
                        return (
                            <Bookmark
                                key={bookmark.id}
                                name={bookmark.name}
                                url={bookmark.url}
                            >
                                <IconButton size="small"
                                    onClick={() => {
                                        this.setNewOrEditBookmarkWindow(true, "edit", bookmark.id);
                                    }}
                                >
                                    <Icon img="edit" color="gray" size="small" />
                                </IconButton>

                                <IconButton size="small"
                                    onClick={() => this.deleteBookmark(bookmark.id)}
                                >
                                    <Icon img="cross" color="gray" size="small" />
                                </IconButton>
                            </Bookmark>
                        )
                    })}

                    <Bookmark type="new" onClick={() => this.setNewOrEditBookmarkWindow(true, "new")} />
                </div>

                {/* ========== Модалка: новая закладка (редактировать) ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.bookmark.window}
                    onClose={() => this.setNewOrEditBookmarkWindow(false)}
                >
                    <ModalWindow isOpened={this.state.bookmark.window}>
                        <ModalHeader>
                            {this.state.bookmark.mode === "new" && <span>Новая закладка</span>}
                            {this.state.bookmark.mode === "edit" && <span>Редактировать</span>}
                            <IconButton size="medium"
                                onClick={() => this.setNewOrEditBookmarkWindow(false)}
                            >
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField autoFocus
                                label="Название:"
                                name="name"
                                value={this.state.bookmark.name}
                                onChange={this.editBookmark}
                            />

                            <Divider spaceY={8} bg="transparent" />

                            <InputField 
                                label="URL:"
                                name="url"
                                value={this.state.bookmark.url}
                                onChange={this.editBookmark}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                disabled={!this.state.bookmark.name || !this.state.bookmark.url}
                                onClick={this.saveBookmark}
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

            </div>
        );
    }
}

export default Bookmarks;
