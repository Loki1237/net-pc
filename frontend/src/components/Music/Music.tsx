import React from 'react';
import styles from './styles/Music.m.css';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

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


import Track from './Track';
import Player from '../../containers/Music/Player';
import { Audio, CurrentTrack } from '../../store/Music/types'; 
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

interface Props {
    isLoading: boolean,
    error: string,
    trackList: Audio[],
    currentTrack: CurrentTrack,
    updateTrackList: () => void,
    setTrackAndPlay: (track: Audio) => void,
    createMusic: (files: FormData) => void,
    changeTrack: (name: string, id: number) => void,
    deleteTrack: (id: number) => void,
    resetState: () => void
}

interface State {
    newMusic: {
        window: boolean,
        fileNames: string[]
    },
    renameTrack: {
        window: boolean,
        name: string,
        id: number
    }
}

class Music extends React.Component<Props, State> {
    fileInput: React.RefObject<HTMLInputElement> = React.createRef();
    state = {
        newMusic: {
            window: false,
            fileNames: []
        },
        renameTrack: {
            window: false,
            name: "",
            id: 0
        }
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

    saveNewTrack = () => {
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

        this.props.createMusic(files);
        this.setNewMusicWindow(false);
    }

    saveRenamedTrack = () => {
        const { name, id } = this.state.renameTrack;
        this.props.changeTrack(name, id);
        this.setRenameTrackWindow(false);
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
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.Music}>
                <Player />

                <div className={styles.body}>
                    <div className={styles.actions}>
                        <Button size="small"
                            color="primary"
                            onClick={() => this.setNewMusicWindow(true)}
                        >
                            Добавить аудиозапись
                        </Button>
                    </div>

                    <SimpleBar className={styles.container}>
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
                    </SimpleBar>
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
            </div>
        );
    }
}

export default Music;
