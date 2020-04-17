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

import { AudioTrackType } from '../../store/music/types'; 

interface PropsType {
    setTrackList: Function,
    trackList: AudioTrackType[]
}

interface StateType {
    sortBy: OptionType,
    newSong: {
        window: boolean,
        artist: string,
        name: string,
        duration: string | null,
        fileName: string
    }
}

interface OptionType {
    label: string,
    value: string
}

const sortOptions: OptionType[] = [
    { label: "По дате", value: "timestamp"},
    { label: "По автору", value: "artist"},
    { label: "По названию", value: "name"}
];

class AudioActions extends React.Component <PropsType, StateType> {
    fileInput: any;
    constructor(props: PropsType) {
        super(props);        
        this.fileInput = React.createRef();
        this.state = {
            sortBy: { label: "", value: "" },
            newSong: {
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

    setSortingOrder = (option: OptionType) => {
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

    setNewSongWindow = (value: boolean) => {
        this.setState({ 
            newSong: {
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
        if (!this.fileInput.current.files[0]) {
            this.setNewSongWindow(true);
            return;
        }

        const fileName = this.fileInput.current.files[0].name.split(" - ");
        this.setState({
            newSong: {
                window: this.state.newSong.window,
                artist: fileName[0],
                name: fileName[1].replace(/.mp3$/, ""),
                duration: null,
                fileName: this.fileInput.current.files[0].name
            }
        });

        const url = URL.createObjectURL(this.fileInput.current.files[0]);
        const audio = new Audio(url);
        audio.onloadedmetadata = () => this.setState({
            newSong: {
                ...this.state.newSong,
                duration: this.setAudioTime(audio.duration)
            }
        });
    }

    saveNewSong = async () => {
        if (!this.state.newSong.artist || !this.state.newSong.name) {
            notify.warn("Введите название песни и имя исполнителя");
            return;
        }

        if (this.state.newSong.duration === null) {
            console.log("Error: music file not found");
            return;
        }

        const myId = await getMyId();
        const musicFile = new FormData();
        const song = new Blob([this.fileInput.current.files[0]], { type: "audio/mpeg" });
        musicFile.append("audio", song, this.fileInput.current.files[0].name);
        musicFile.append("artist", this.state.newSong.artist);
        musicFile.append("name", this.state.newSong.name);
        musicFile.append("duration", this.state.newSong.duration);

        const res = await fetch(`/api/music/${myId}`, {
            method: "POST",
            body: musicFile
        });

        if (res.status !== 200) {
            console.log("Error: " + res.statusText);
            return;
        }
        
        this.updateMusicList();
        this.setNewSongWindow(false);
    }

    render() {
        return (
            <div className={styles.AudioActions}>
                <Select outline
                    width={160}
                    label={<img src={iconSort} width={14} height={14}/>}
                    selected={this.state.sortBy}
                    onChange={(option: OptionType) => {
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
                    onClick={() => this.setNewSongWindow(true)}
                >
                    Добавить аудиозапись
                </Button>

                <Backdrop 
                    blackout
                    isOpened={this.state.newSong.window}
                    onClose={() => this.setNewSongWindow(false)}
                >
                    <ModalWindow>
                        <ModalHeader color="primary">
                            <span>Новая аудиозапись</span>
                            <IconButton onClick={() => this.setNewSongWindow(false)}>
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
                                    value={this.state.newSong.fileName}
                                />
                            </div>

                            <Divider spaceY={8} bg="transparent" />
                            <InputField
                                label="Исполнитель:"
                                disabled={this.state.newSong.duration === null}
                                value={this.state.newSong.artist}
                                onChange={(e: any) => {
                                    this.setState({ newSong: { 
                                        ...this.state.newSong, 
                                        artist: e.target.value 
                                    } });
                                }}
                            />

                            <Divider spaceY={6} bg="transparent" />
                            <InputField
                                label="Название:"
                                disabled={this.state.newSong.duration === null}
                                value={this.state.newSong.name}
                                onChange={(e: any) => {
                                    this.setState({ newSong: { 
                                        ...this.state.newSong, 
                                        name: e.target.value 
                                    } });
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                onClick={this.saveNewSong}
                                disabled={this.state.newSong.duration === null}
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
