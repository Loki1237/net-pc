import React from 'react';
import styles from './styles/Bookmarks.m.css';

import { getMyId } from '../../middleware';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import Bookmark from './Bookmark';

import {
    Backdrop,
    Button,
    Divider,
    IconButton,
    InputField,
    Loading,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    Select
} from '../../shared';

import iconEditGray from '../../shared/icons/icon_edit_gray.png';
import iconCrossWhite from '../../shared/icons/icon_cross_white.png';
import iconCrossGray from '../../shared/icons/icon_cross_gray.png';

interface PropsType {
    
}

interface StateType {
    bookmarkList: any[],
    newBookmark: {
        window: boolean,
        name: string,
        url: string
    },
    changeBookmark: {
        window: boolean,
        name: string,
        url: string,
        id: number | null
    }
}

class Bookmarks extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            bookmarkList: [],
            newBookmark: {
                window: false,
                name: "",
                url: ""
            },
            changeBookmark: {
                window: false,
                name: "",
                url: "",
                id: null
            }
        };
    }

    async componentDidMount() {
        await this.updateBookamrkList();
    }

    updateBookamrkList = async () => {
        const myId = await getMyId();

        const resBookmarks = await fetch(`/api/bookmarks/${myId}`);
        const bookmarks = await resBookmarks.json();

        this.setState({ bookmarkList: bookmarks });
    }
    
    setNewBookmarkWindow = (value: boolean) => {
        this.setState({
            newBookmark: {
                window: value,
                name: "",
                url: ""
            }
        });
    }

    setChangeBookmarkWindow = (value: boolean, id?: number) => {
        const bookmarks = this.state.bookmarkList;
        const i = _.findIndex(bookmarks, { id });

        this.setState({
            changeBookmark: {
                window: value,
                name: i >= 0 ? bookmarks[i].name : "",
                url: i >= 0 ? bookmarks[i].url : "",
                id: id || null
            }
        });
    }

    saveNewBookmark = async () => {
        if (!this.state.newBookmark.name || !this.state.newBookmark.url) {
            notify.warn("Введите название и адрес закладки");
            return;
        }

        const myId = await getMyId();

        await fetch('api/bookmarks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                userId: myId,
                name: this.state.newBookmark.name,
                url: this.state.newBookmark.url
            })
        });

        this.updateBookamrkList();
        this.setNewBookmarkWindow(false);
    }

    saveChangedBookmark = async () => {
        if (!this.state.changeBookmark.name || !this.state.changeBookmark.url) {
            notify.warn("Введите название и адрес закладки");
            return;
        }

        const changedBookmark = this.state.changeBookmark;

        await fetch(`api/bookmarks/${changedBookmark.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                name: changedBookmark.name,
                url: changedBookmark.url
            })
        });

        this.updateBookamrkList();
        this.setChangeBookmarkWindow(false);
    }

    deleteBookmark = async (id: number) => {
        await fetch('api/bookmarks', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ id })
        });

        this.updateBookamrkList();
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
                                        this.setChangeBookmarkWindow(true, bookmark.id);
                                    }}
                                >
                                    <img src={iconEditGray} width={12} height={12} />
                                </IconButton>

                                <IconButton size="small"
                                    onClick={() => this.deleteBookmark(bookmark.id)}
                                >
                                    <img src={iconCrossGray} width={12} height={12} />
                                </IconButton>
                            </Bookmark>
                        )
                    })}

                    <Bookmark plus onClick={() => this.setNewBookmarkWindow(true)} />
                </div>

                {/* ========== Модалка: новая закладка ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.newBookmark.window}
                    onClose={() => this.setNewBookmarkWindow(false)}
                >
                    <ModalWindow>
                        <ModalHeader color="primary">
                            <span>Новая закладка</span>
                            <IconButton size="medium"
                                onClick={() => this.setNewBookmarkWindow(false)}
                            >
                                <img src={iconCrossWhite} width={18} height={18} />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField 
                                label="Название:"
                                value={this.state.newBookmark.name}
                                onChange={(e: any) => {
                                    this.setState({ newBookmark: {
                                        ...this.state.newBookmark,
                                        name: e.target.value
                                    }});
                                }}
                            />

                            <Divider spaceY={8} bg="transparent" />

                            <InputField 
                                label="URL:"
                                value={this.state.newBookmark.url}
                                onChange={(e: any) => {
                                    this.setState({ newBookmark: {
                                        ...this.state.newBookmark,
                                        url: e.target.value
                                    }});
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.saveNewBookmark}>
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

                {/* ========== Модалка: редактировать закладку ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.changeBookmark.window}
                    onClose={() => this.setChangeBookmarkWindow(false)}
                >
                    <ModalWindow>
                        <ModalHeader color="primary">
                            <span>Редактировать</span>
                            <IconButton size="medium"
                                onClick={() => this.setChangeBookmarkWindow(false)}
                            >
                                <img src={iconCrossWhite} width={18} height={18} />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField 
                                label="Название:"
                                value={this.state.changeBookmark.name}
                                onChange={(e: any) => {
                                    this.setState({ changeBookmark: {
                                        ...this.state.changeBookmark,
                                        name: e.target.value
                                    }});
                                }}
                            />

                            <Divider spaceY={8} bg="transparent" />

                            <InputField 
                                label="URL:"
                                value={this.state.changeBookmark.url}
                                onChange={(e: any) => {
                                    this.setState({ changeBookmark: {
                                        ...this.state.changeBookmark,
                                        url: e.target.value
                                    }});
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.saveChangedBookmark}>
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
