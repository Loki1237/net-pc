import React from 'react';
import styles from './styles/Music.m.css';

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
    createTrack: (file: FormData) => void,
    changeTrack: (artist: string, name: string, id: number) => void,
    deleteTrack: (id: number) => void,
    resetState: () => void
}

class Music extends React.Component<Props> {
    fileInput: React.RefObject<HTMLInputElement> = React.createRef();
    state = {
        newTrack: {
            window: false,
            artist: "",
            name: "",
            duration: 0,
            fileName: ""
        },
        renameTrack: {
            window: false,
            artist: "",
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

    setNewTrackWindow = (value: boolean) => {
        this.setState({ 
            newTrack: {
                window: value,
                artist: "",
                name: "",
                duration: null,
                fileName: ""
            }
        });
    }

    setRenameTrackWindow = (value: boolean, track?: Audio) => {
        this.setState({
            renameTrack: {
                window: value,
                artist: track ? track.artist : "",
                name: track ? track.name : "",
                id: track ? track.id : 0
            }
        });
    }

    setFile = () => {
        if (!this.fileInput.current) {
            this.setNewTrackWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;

        if (!fileList) {
            this.setNewTrackWindow(true);
            return;
        }

        const fileName = fileList[0].name.split(" - ");
        this.setState({
            newTrack: {
                window: this.state.newTrack.window,
                artist: fileName[0],
                name: fileName[1].replace(/.mp3$/, ""),
                duration: null,
                fileName: fileList[0].name
            }
        });

        const url = URL.createObjectURL(fileList[0]);
        const audio = new Audio(url);
        audio.onloadedmetadata = () => this.setState({
            newTrack: {
                ...this.state.newTrack,
                duration: this.setAudioTime(audio.duration)
            }
        });
    }

    setAudioTime = (time: number) => {
        const ms = Math.floor(time * 1000);
        const date = new Date(ms);

        let minutes = date.getMinutes();
        let seconds = `${date.getSeconds()}`;
        if (seconds.length < 2) seconds = `0${seconds}`;

        return `${minutes}:${seconds}`;
    }

    editNewTrackName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newTrack: { 
            ...this.state.newTrack, 
            [e.target.name]: e.target.value 
        } });
    }

    renameTrack = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ renameTrack: { 
            ...this.state.renameTrack, 
            [e.target.name]: e.target.value 
        } });
    }

    saveNewTrack = () => {
        if (!this.state.newTrack.artist || !this.state.newTrack.name) {
            notify.warn("Введите название песни и имя исполнителя");
            return;
        }

        if (this.state.newTrack.duration === null) {
            console.log("Error: music file not found");
            return;
        }

        if (!this.fileInput.current) {
            this.setNewTrackWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;

        if (!fileList) {
            this.setNewTrackWindow(true);
            return;
        }

        const file = new FormData();
        const track = new Blob([fileList[0]], { type: "audio/mpeg" });
        file.append("audio", track, fileList[0].name);
        file.append("artist", this.state.newTrack.artist);
        file.append("name", this.state.newTrack.name);
        file.append("duration", `${this.state.newTrack.duration}`);

        this.props.createTrack(file);
        this.setNewTrackWindow(false);
    }

    saveRenamedTrack = () => {
        const { artist, name, id } = this.state.renameTrack;
        this.props.changeTrack(artist, name, id);
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
                <div className={styles.actions}>
                    <Button size="small"
                        color="primary"
                        onClick={() => this.setNewTrackWindow(true)}
                    >
                        Добавить аудиозапись
                    </Button>
                </div>

                <div className={styles.container}>
                    {this.props.trackList.map(track => {
                        const currentTrack = this.props.currentTrack;

                        return (
                            <Track key={track.id}
                                artist={track.artist}
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
                </div>

                {/* ========== Модалка: новый трек ========== */}
                <Backdrop 
                    blackout
                    isOpened={this.state.newTrack.window}
                    onClose={() => this.setNewTrackWindow(false)}
                >
                    <ModalWindow isOpened={this.state.newTrack.window}>
                        <ModalHeader>
                            <span>Новая аудиозапись</span>
                            <IconButton onClick={() => this.setNewTrackWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <Divider spaceY={4} bg="transparent" />
                            <div className={styles.audio_file_input}>
                                <Button color="primary">
                                    <label>
                                        <input type="file" 
                                            ref={this.fileInput} 
                                            name="audio"
                                            onChange={this.setFile}
                                        />
                                    </label>
                                    Выберите файл
                                </Button>

                                <InputField readOnly
                                    value={this.state.newTrack.fileName}
                                />
                            </div>

                            <Divider spaceY={8} bg="transparent" />
                            <InputField
                                label="Исполнитель:"
                                disabled={this.state.newTrack.duration === null}
                                name="artist"
                                value={this.state.newTrack.artist}
                                onChange={this.editNewTrackName}
                            />

                            <Divider spaceY={6} bg="transparent" />
                            <InputField
                                label="Название:"
                                disabled={this.state.newTrack.duration === null}
                                name="name"
                                value={this.state.newTrack.name}
                                onChange={this.editNewTrackName}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                onClick={this.saveNewTrack}
                                disabled={this.state.newTrack.duration === null}
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
                                label="Исполнитель:"
                                name="artist"
                                value={this.state.renameTrack.artist}
                                onChange={this.renameTrack}
                            />

                            <Divider spaceY={4} bg="transparent" />

                            <InputField 
                                label="Название:"
                                name="name"
                                value={this.state.renameTrack.name}
                                onChange={this.renameTrack}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
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
