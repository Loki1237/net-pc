import React from 'react';
import styles from './Styles.m.css';

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

import iconSort from '../../shared/icons/icon_sort.png';
import iconCrossWhite from '../../shared/icons/icon_cross_white.png';

import { getMyId } from '../../middleware';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import { Audio } from '../../store/Music/types'; 

interface Props {
    setTrackList: Function,
    trackList: Audio[],
    userId: number
}

interface State {
    sortBy: SortOption,
    newTrack: {
        window: boolean,
        artist: string,
        name: string,
        duration: string | null,
        fileName: string
    }
}

interface SortOption {
    label: string,
    value: string
}

const sortOptions: SortOption[] = [
    { label: "По дате", value: "timestamp"},
    { label: "По автору", value: "artist"},
    { label: "По названию", value: "name"}
];

class AudioActions extends React.Component<Props, State> {
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);        
        this.fileInput = React.createRef();
        this.state = {
            sortBy: { label: "", value: "" },
            newTrack: {
                window: false,
                artist: "",
                name: "",
                duration: null,
                fileName: ""
            }
        };
    }

    async componentDidMount() {
        await this.updateMusicList();

        const orderSorting = localStorage.getItem("audio_sort");
        const i = _.findIndex(sortOptions, { value: orderSorting || "date" });

        if (orderSorting) {
            this.sortMusic(orderSorting);
            this.setState({ sortBy: sortOptions[i] });
        } else {
            this.sortMusic("date");
            this.setSortingOrder(sortOptions[0]);
        }
        
    }

    updateMusicList = async () => {
        const myId = await getMyId();

        const resMusic = await fetch(`/api/music/${myId}`);
        const music = await resMusic.json();

        this.props.setTrackList(music);
    }

    setSortingOrder = (option: SortOption) => {
        this.setState({ sortBy: option });
        localStorage.setItem("audio_sort", `${option.value}`);
    }

    sortMusic = (order: string) => {
        if (order !== "artist" && order !== "name" && order !== "timestamp") {
            return;
        }

        const sortedList = this.props.trackList.sort((track1, track2) => {
            if (track1[order] > track2[order]) return 1;
            if (track1[order] < track2[order]) return -1;
            return 0;
        });

        this.props.setTrackList([]);
        this.props.setTrackList(sortedList);
    }

    mixMusic = () => {
        const randomTrackList = [...this.props.trackList];
        let j, temp;

        for (let i = randomTrackList.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            temp = randomTrackList[j];
            randomTrackList[j] = randomTrackList[i];
            randomTrackList[i] = temp;
        }

        this.props.setTrackList([]);
        this.props.setTrackList(randomTrackList);
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

    setAudioTime = (time: number) => {
        const ms = Math.floor(time * 1000);
        const date = new Date(ms);

        let minutes = date.getMinutes();
        let seconds = `${date.getSeconds()}`;
        if (seconds.length < 2) seconds = `0${seconds}`;

        return `${minutes}:${seconds}`;
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

    editNewTrackName = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        this.setState({ newTrack: { 
            ...this.state.newTrack, 
            [target.name]: target.value 
        } });
    }

    saveNewTrack = async () => {
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

        const myId = await getMyId();
        const musicFile = new FormData();
        const song = new Blob([fileList[0]], { type: "audio/mpeg" });
        musicFile.append("audio", song, fileList[0].name);
        musicFile.append("artist", this.state.newTrack.artist);
        musicFile.append("name", this.state.newTrack.name);
        musicFile.append("duration", this.state.newTrack.duration);

        const res = await fetch(`/api/music/${myId}`, {
            method: "POST",
            body: musicFile
        });

        if (res.status !== 200) {
            console.log("Error: " + res.statusText);
            return;
        }
        
        this.updateMusicList();
        this.setNewTrackWindow(false);
    }

    render() {
        return (
            <div className={styles.AudioActions}>
                <Select outline
                    width={160}
                    label={<img src={iconSort} width={14} height={14}/>}
                    value={this.state.sortBy}
                    onChange={(option: SortOption) => {
                        this.setSortingOrder(option);
                        this.sortMusic(option.value);
                    }}
                    options={sortOptions}
                />

                <Button size="small"
                    style={{ width: 160 }}
                    color="info" 
                    onClick={this.mixMusic}
                >
                    Перемешать
                </Button>

                <Divider spaceY={8} />

                <Button size="small"
                    style={{ width: 160 }}
                    color="primary" 
                    onClick={() => this.setNewTrackWindow(true)}
                >
                    Добавить аудиозапись
                </Button>

                <Backdrop 
                    blackout
                    isOpened={this.state.newTrack.window}
                    onClose={() => this.setNewTrackWindow(false)}
                >
                    <ModalWindow isOpened={this.state.newTrack.window}>
                        <ModalHeader>
                            <span>Новая аудиозапись</span>
                            <IconButton onClick={() => this.setNewTrackWindow(false)}>
                                <img src={iconCrossWhite} width={18} height={18} />
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
            </div>
        );
    }
}

export default AudioActions;
