import React from 'react';
import styles from './Bookmarks.css';

import Bookmark from './Bookmark';

import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import InputField from '../../components/InputField/InputField';

import iconPlusGray from '../../components/icons/icon_plus_gray.png';
import iconEditGray from '../../components/icons/icon_edit_gray.png';
import iconCrossWhite from '../../components/icons/icon_cross_white.png';
import iconCrossGray from '../../components/icons/icon_cross_gray.png';
import iconUser from '../../components/icons/icon_user.png';
import iconLink from '../../components/icons/icon_link.png';

interface PropsType {
    
}

interface StateType {
    bookmarkList: any[],
    windowNewBookmark: boolean,
    newBookmarkName: string,
    newBookmarkURL: string
}

class Bookmarks extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            bookmarkList: [],
            windowNewBookmark: false,
            newBookmarkName: "",
            newBookmarkURL: ""
        };
    }

    async componentDidMount() {
        await this.updateBookamrkList();
    }

    updateBookamrkList = async () => {
        const resUser = await fetch('/api/users/login-as', { method: "POST" });
        const user = await resUser.json();

        const resBookmarks = await fetch(`/api/bookmarks/${user.id}`);
        const bookmarks = await resBookmarks.json();

        this.setState({ bookmarkList: bookmarks });
    }
    
    setWindowNewBookmark = (value: boolean) => {
        this.setState({
            windowNewBookmark: value, 
            newBookmarkName: "",
            newBookmarkURL: ""
        });
    }

    saveBookmarkLink = async () => {
        if (this.state.newBookmarkName && this.state.newBookmarkURL) {
            const resUser = await fetch('/api/users/login-as', { method: "POST" });
            const user = await resUser.json();

            await fetch('api/bookmarks', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify({
                    userId: user.id,
                    name: this.state.newBookmarkName,
                    url: this.state.newBookmarkURL
                })
            });

            this.updateBookamrkList();
            this.setWindowNewBookmark(false);
        }
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
                <div className={styles.header}>
                    Ссылки
                </div>

                <div className={styles.bookmarks_container}>
                    {this.state.bookmarkList.map(bookmark => {
                        return (
                            <Bookmark
                                key={bookmark.id}
                                name={bookmark.name}
                                url={bookmark.url}
                            >
                                <IconButton size="small">
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

                    <Bookmark>
                        <IconButton size="large"
                            onClick={() => this.setWindowNewBookmark(true)}
                        >
                            <img src={iconPlusGray} width={32} height={32} />
                        </IconButton>
                    </Bookmark>
                </div>

                <Backdrop 
                    blackout
                    isOpened={this.state.windowNewBookmark}
                    onClose={() => this.setWindowNewBookmark(false)}
                >
                    <ModalWindow>
                        <ModalHeader color="primary">
                            <span>Новая закладка</span>
                            <IconButton size="medium"
                                onClick={() => this.setWindowNewBookmark(false)}
                            >
                                <img src={iconCrossWhite} width={18} height={18} />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField 
                                label="Название"
                                value={this.state.newBookmarkName}
                                onChange={(e: any) => {
                                    this.setState({ newBookmarkName: e.target.value });
                                }}
                            />

                            <InputField 
                                label="URL"
                                value={this.state.newBookmarkURL}
                                onChange={(e: any) => {
                                    this.setState({ newBookmarkURL: e.target.value });
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.saveBookmarkLink}>
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
