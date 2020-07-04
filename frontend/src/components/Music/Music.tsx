import React from 'react';
import styles from './styles/Music.m.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

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
    ModalWindow,
    TextArea
} from '../../shared';

import Track from './Track';
import Playlist from './Playlist';
import Player from '../../containers/Music/Player';
import { Audio, CurrentTrack, Playlist as PlaylistType } from '../../store/Music/types'; 
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

interface Props {
    isLoading: boolean,
    error: string,
    trackList: Audio[],
    playlists: PlaylistType[],
    currentTrack: CurrentTrack,
    updateTrackList: () => void,
    updatePlaylists: () => void,
    setTrackAndPlay: (track: Audio) => void,
    createMusic: (files: FormData) => void,
    createPlaylist: (name: string, discription: string) => void,
    setPlaylist: (id: number) => void,
    changeTrack: (name: string, id: number) => void,
    deleteTrack: (id: number) => void,
    resetState: () => void
}

interface State {
    newMusic: {
        window: boolean,
        fileNames: string[]
    },
    newPlaylist: {
        window: boolean,
        name: string,
        discription: string
    },
    renameTrack: {
        window: boolean,
        name: string,
        id: number
    },
    playlist: {
        window: boolean,
        name: string,
        discription: string,
        id: number
    },
    currentSection: "playlists" | "all"
}

class Music extends React.Component<Props, State> {
    fileInput: React.RefObject<HTMLInputElement> = React.createRef();
    state: State = {
        newMusic: {
            window: false,
            fileNames: []
        },
        newPlaylist: {
            window: false,
            name: "",
            discription: ""
        },
        renameTrack: {
            window: false,
            name: "",
            id: 0
        },
        playlist: {
            window: false,
            name: "",
            discription: "",
            id: 0
        },
        currentSection: "all"
    };

    componentDidMount() {
        this.props.updateTrackList();
    }

    componentWillUnmount() {
        this.props.currentTrack.audioFile.pause();
        this.props.resetState();
    }

    selectTrack = (track: Audio) => {
        const currentTrack = this.props.currentTrack;

        if (track.id === currentTrack.data.id && currentTrack.audioFile.paused) {
            this.props.currentTrack.audioFile.play();
        } else if (track.id === currentTrack.data.id && !currentTrack.audioFile.paused) {
            this.props.currentTrack.audioFile.pause();
        } else {
            this.props.currentTrack.audioFile.pause();
            this.props.setTrackAndPlay(track);
        }
    }

    setNewPlaylistWindow = (value: boolean) => {
        this.setState({
            newPlaylist: {
                ...this.state.newPlaylist,
                window: value
            }
        });
    }

    saveNewPlaylist = async () => {
        const { name, discription } = this.state.newPlaylist;

        try {
            await this.props.createPlaylist(name, discription);
            this.setNewPlaylistWindow(false);
        } catch (error) {
            notify.error(error);
        }
    }

    editNewPlaylist = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({ newPlaylist: { 
            ...this.state.newPlaylist, 
            [e.target.name]: e.target.value 
        } });
    }

    setPlaylist = async (value: boolean, playlist?: PlaylistType) => {
        this.setState({
           playlist: {
                window: value,
                name: playlist?.name || this.state.playlist.name,
                discription: playlist?.discription || this.state.playlist.discription,
                id: playlist?.id || this.state.playlist.id
            }
        });

        if (playlist) {
            this.props.setPlaylist(playlist.id);
        }
    }

    setNewMusicWindow = (value: boolean) => {
        this.setState({ 
            newMusic: {
                window: value,
                fileNames: []
            }
        });
    }

    setRenameTrackWindow = (value: boolean, track?: Audio) => {
        this.setState({
            renameTrack: {
                window: value,
                name: track ? track.name : "",
                id: track ? track.id : 0
            }
        });
    }

    setFile = () => {
        if (!this.fileInput.current) {
            this.setNewMusicWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;
        const fileNames = [];

        if (!fileList) {
            this.setNewMusicWindow(true);
            return;
        }
        
        for (let i = 0; i < fileList.length; i++) {
            fileNames.push(fileList[i].name);
        }

        this.setState({ 
            newMusic: {
                ...this.state.newMusic,
                fileNames
            } 
        });
    }

    renameTrack = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ renameTrack: { 
            ...this.state.renameTrack, 
            [e.target.name]: e.target.value 
        } });
    }

    saveNewTrack = async () => {
        if (!this.fileInput.current) {
            this.setNewMusicWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;

        if (!fileList) {
            this.setNewMusicWindow(true);
            return;
        }

        const files = new FormData();
        
        for (let i = 0; i < fileList.length; i++) {
            const track = new Blob([fileList[i]], { type: "audio/mpeg" });
            files.append("audio", track, fileList[i].name);
        }

        try {
            await this.props.createMusic(files);
            this.setNewMusicWindow(false);
        } catch (error) {
            notify.error(error);
        }
        
    }

    saveRenamedTrack = () => {
        const { name, id } = this.state.renameTrack;
        this.props.changeTrack(name, id);
        this.setRenameTrackWindow(false);
    }

    setCurrentSection = () => {
        if (this.state.currentSection === "all") {
            this.props.updatePlaylists();
        } else {
            this.props.updateTrackList();
        }
        this.setState({ currentSection: this.state.currentSection === "all" ? "playlists" : "all" });
    }

    renderLoading = () => (
        <div className={styles.Music}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Music}>
            <LoadingError error={this.props.error} />
        </div>
    );

    render() {
        if (this.props.error) {
            return this.renderError();
        }

        return (
            <div className={styles.Music}>
                <Player />

                <div className={styles.body}>
                    <div className={styles.actions}>
                        <Button size="small"
                            color="primary"
                            onClick={this.setCurrentSection}
                        >
                            {this.state.currentSection === "all" ? "Плейлисты" : "Моя музыка"}
                        </Button>

                        <Divider spaceY={8} />

                        {this.state.currentSection === "all" &&
                            <Button size="small"
                                color="primary"
                                onClick={() => this.setNewMusicWindow(true)}
                            >
                                Добавить музыку
                            </Button>
                        }

                        {this.state.currentSection === "playlists" &&
                            <Button size="small"
                                color="primary"
                                onClick={() => this.setNewPlaylistWindow(true)}
                            >
                                Добавить плейлист
                            </Button>
                        }
                    </div>

                    {this.state.currentSection === "all" &&
                        <PerfectScrollbar className={styles.music_container}>
                            {this.props.trackList.map(track => {
                                const currentTrack = this.props.currentTrack;

                                return (
                                    <Track key={track.id}
                                        name={track.name}
                                        url={track.url}
                                        duration={track.duration}
                                        selected={currentTrack.data.id === track.id}
                                        playing={currentTrack.status === "playing" && currentTrack.data.id === track.id}
                                        onClick={() => this.selectTrack(track)}
                                        rename={() => this.setRenameTrackWindow(true, track)}
                                        delete={() => this.props.deleteTrack(track.id)}
                                    />
                                );
                            })}

                            {this.props.isLoading && !this.props.trackList.length && <Loading />}
                        </PerfectScrollbar>
                    }

                    {this.state.currentSection === "playlists" &&
                        <PerfectScrollbar className={styles.playlist_container}>
                            {this.props.playlists.map(playlist => {
                                return (
                                    <Playlist key={playlist.id}
                                        name={playlist.name}
                                        discription={playlist.discription}
                                        onClick={() => this.setPlaylist(true, playlist)}
                                    />
                                );
                            })}

                            {this.props.isLoading && !this.props.playlists.length && <Loading />}
                        </PerfectScrollbar>
                    }
                </div>

                {/* ========== Модалка: новый трек ========== */}
                <Backdrop 
                    blackout
                    isOpened={this.state.newMusic.window}
                    onClose={() => this.setNewMusicWindow(false)}
                >
                    <ModalWindow isOpened={this.state.newMusic.window}>
                        <ModalHeader>
                            <span>Новая аудиозапись</span>
                            <IconButton onClick={() => this.setNewMusicWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="left">
                            <Divider spaceY={4} bg="transparent" />
                            <div className={styles.audio_file_input}>
                                <Button color="primary">
                                    <label>
                                        <input type="file" 
                                            ref={this.fileInput} 
                                            name="audio"
                                            multiple
                                            onChange={this.setFile}
                                        />
                                    </label>
                                    Выберите аудиофайлы
                                </Button>

                                <div>
                                    {this.state.newMusic.fileNames.map(name => {
                                        return <p key={name}>{name}</p>
                                    })}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                onClick={this.saveNewTrack}
                                disabled={!this.state.newMusic.fileNames.length}
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

                {/* ========== Модалка: редактировать ========== */}
                <Backdrop blackout
                    isOpened={this.state.renameTrack.window}
                    onClose={() => this.setRenameTrackWindow(false)}
                >
                    <ModalWindow isOpened={this.state.renameTrack.window}>
                        <ModalHeader>
                            <span>Редактировать</span>
                            <IconButton onClick={() => this.setRenameTrackWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField 
                                label="Название:"
                                name="name"
                                value={this.state.renameTrack.name}
                                onChange={this.renameTrack}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
                                disabled={!this.state.renameTrack.name}
                                onClick={this.saveRenamedTrack}
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

                {/* ========== Модалка: новый плейлист ========== */}
                <Backdrop 
                    blackout
                    isOpened={this.state.newPlaylist.window}
                    onClose={() => this.setNewPlaylistWindow(false)}
                >
                    <ModalWindow isOpened={this.state.newPlaylist.window}>
                        <ModalHeader>
                            <span>Новый плейлист</span>
                            <IconButton onClick={() => this.setNewPlaylistWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField label="Название"
                                name="name"
                                value={this.state.newPlaylist.name}
                                onChange={this.editNewPlaylist}
                            />

                            <TextArea minRows={5} maxRows={5}
                                label="Описание:"
                                name="discription"
                                value={this.state.newPlaylist.discription}
                                onChange={this.editNewPlaylist}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                onClick={this.saveNewPlaylist}
                                disabled={!this.state.newPlaylist.name}
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

                {/* ========== Модалка: текущий плейлист ========== */}
                <Backdrop 
                    blackout
                    isOpened={this.state.playlist.window}
                    onClose={() => this.setPlaylist(false)}
                >
                    <ModalWindow isOpened={this.state.playlist.window} size="large">
                        <ModalHeader>
                            <span>{this.state.playlist.name}</span>
                            <IconButton onClick={() => this.setPlaylist(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <Player variant="reduced"/>
                            <p>{this.state.playlist.discription}</p>

                            {this.props.trackList.map(track => {
                                const currentTrack = this.props.currentTrack;

                                return (
                                    <Track key={track.id}
                                        name={track.name}
                                        url={track.url}
                                        duration={track.duration}
                                        selected={currentTrack.data.id === track.id}
                                        playing={currentTrack.status === "playing" && currentTrack.data.id === track.id}
                                        onClick={() => this.selectTrack(track)}
                                        rename={() => this.setRenameTrackWindow(true, track)}
                                        delete={() => this.props.deleteTrack(track.id)}
                                    />
                                );
                            })}
                        </ModalBody>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default Music;
