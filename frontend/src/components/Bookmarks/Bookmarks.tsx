import React from 'react';
import styles from './styles/Bookmarks.m.css';

import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import Bookmark from './Bookmark';
import { Bookmark as BookmarkType } from '../../store/Bookmarks/types';

import {
    Backdrop,
    Button,
    Divider,
    Icon,
    IconButton,
    InputField,
    Loading,
    LoadingError,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow
} from '../../shared';

interface Props {
    isLoading: boolean,
    error: string,
    bookmarkList: BookmarkType[],
    updateBookmarkList: () => void,
    createBookmark: (name: string, url: string) => void,
    changeBookmark: (name: string, url: string, id: number) => void,
    deleteBookmark: (id: number) => void,
    resetState: () => void
}

class Bookmarks extends React.Component<Props> {
    state = {
        bookmark: {
            window: false,
            name: "",
            url: "",
            id: 0,
            mode: "new" // new || edit
        }
    };

    componentDidMount() {
        this.props.updateBookmarkList();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    openBookmarkModalWindow = (mode: string, id?: number) => {
        const bookmarks = this.props.bookmarkList;
        const i = id ? _.findIndex(bookmarks, { id }) : 0;
        const currentBookmark = bookmarks[i];

        if (mode !== "new" && mode !== "edit") {
            return;
        }

        this.setState({
            bookmark: {
                window: true,
                name: mode === "edit" ? currentBookmark.name : "",
                url: mode === "edit" ? currentBookmark.url : "",
                id: id ? id : 0,
                mode
            }
        });
    }

    closeBookmarkModalWindow = () => {
        this.setState({ bookmark: { ...this.state.bookmark, id: 0, window: false } });
    }

    saveBookmark = async () => {
        const { name, url, id, mode } = this.state.bookmark;

        if (!name || !url) {
            notify.warn("Введите название и адрес закладки");
            return;
        }

        switch(mode) {
            case "new":
                this.props.createBookmark(name, url);
                break;

            case "edit":
                this.props.changeBookmark(name, url, id);
                break;
        }
        
        this.closeBookmarkModalWindow();
    }

    editBookmark = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ bookmark: {
            ...this.state.bookmark,
            [e.target.name]: e.target.value
        }});
    }

    renderLoading = () => (
        <div className={styles.Bookmarks}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Bookmarks}>
            <LoadingError error={this.props.error} />
        </div>
    );

    render() {
        if (this.props.error) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.Bookmarks}>
                <div className={styles.header}>
                    <span>
                        Мои закладки
                    </span>
                    
                    <Button color="primary" size="small"
                        onClick={() => this.openBookmarkModalWindow("new")}
                    >
                        Добавить закладку
                    </Button>
                </div>

                <div className={styles.container}>
                    {this.props.bookmarkList.map(bookmark => {
                        return (
                            <Bookmark key={bookmark.id}
                                name={bookmark.name}
                                url={bookmark.url}
                                edit={() => this.openBookmarkModalWindow("edit", bookmark.id)}
                                delete={() => this.props.deleteBookmark(bookmark.id)}
                            />
                        )
                    })}
                </div>

                {/* ========== Модалка: закладка (новая, редактировать) ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.bookmark.window}
                    onClose={() => this.closeBookmarkModalWindow()}
                >
                    <ModalWindow isOpened={this.state.bookmark.window}>
                        <ModalHeader>
                            {this.state.bookmark.mode === "new" && <span>Новая закладка</span>}
                            {this.state.bookmark.mode === "edit" && <span>Редактировать</span>}
                            <IconButton size="medium"
                                onClick={() => this.closeBookmarkModalWindow()}
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
