import React from 'react';
import styles from './Styles.m.css';

import {
    Backdrop,
    Button,
    Divider,
    IconButton,
    InputField,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow,
} from '../../shared';

import iconCrossWhite from '../../shared/icons/icon_cross_white.png';

import AudioTrack from './AudioTrack';
import { AudioTrackType } from '../../store/music/types'; 

import { getMyId } from '../../middleware';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

interface PropsType {
    currentTrack: AudioTrackType,
    trackList: AudioTrackType[],
    selectTrack: Function,
    setTrackList: Function
}

interface StateType {
    renameTrack: {
        window: boolean,
        artist: string,
        name: string,
        id: number
    }
}

class AudioContainer extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            renameTrack: {
                window: false,
                artist: "",
                name: "",
                id: 0
            }
        };
    }

    updateMusicList = async () => {
        const myId = await getMyId();

        const resMusic = await fetch(`/api/music/${myId}`);
        const music = await resMusic.json();

        this.props.setTrackList(music);
    }

    selectTrack = (track: any) => {
        if (track.id === this.props.currentTrack.id) {
            return;
        }

        this.props.selectTrack({ 
            ...track, 
            url: '/api/audio/' + track.url
        });
    }

    setRenameTrackWindow = (value: boolean, track?: AudioTrackType) => {
        this.setState({
            renameTrack: {
                window: value,
                artist: track ? track.artist : "",
                name: track ? track.name : "",
                id: track ? track.id : 0
            }
        });
    }

    renameTrack = async () => {
        await fetch(`api/music/${this.state.renameTrack.id}`, { 
            method: "PUT",
            headers: {
                "Content-Type": "Application/json;charset=utf-8"
            },
            body: JSON.stringify(this.state.renameTrack)
        });

        this.updateMusicList();
        this.setRenameTrackWindow(false);
    }

    deleteTrack = async (id: number) => {
        await fetch(`api/music/${id}`, { method: "DELETE" });

        this.updateMusicList();
    }

    render() {
        return (
            <div className={styles.AudioContainer}>
                {this.props.trackList.map(track => (
                    <AudioTrack key={track.id}
                        artist={track.artist}
                        name={track.name}
                        url={track.url}
                        duration={track.duration}
                        selected={this.props.currentTrack.url === '/api/audio/' + track.url}
                        play={() => this.selectTrack(track)}
                        rename={() => this.setRenameTrackWindow(true, track)}
                        delete={() => this.deleteTrack(track.id)}
                    />
                ))}

                <Backdrop blackout
                    isOpened={this.state.renameTrack.window}
                    onClose={() => this.setRenameTrackWindow(false)}
                >
                    <ModalWindow>
                        <ModalHeader>
                            <span>Загрузить фото</span>
                            <IconButton onClick={() => this.setRenameTrackWindow(false)}>
                                <img src={iconCrossWhite} width={18} height={18} />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <InputField 
                                label="Исполнитель:"
                                value={this.state.renameTrack.artist}
                                onChange={(e: any) => {
                                    this.setState({ renameTrack: {
                                        ...this.state.renameTrack,
                                        artist: e.target.value
                                    }});
                                }}
                            />

                            <Divider spaceY={4} bg="transparent" />

                            <InputField 
                                label="Название:"
                                value={this.state.renameTrack.name}
                                onChange={(e: any) => {
                                    this.setState({ renameTrack: {
                                        ...this.state.renameTrack,
                                        name: e.target.value
                                    }});
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
                                onClick={this.renameTrack}
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

export default AudioContainer;
