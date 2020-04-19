import React from 'react';
import styles from './Styles.m.css';

import {
    IconButton,
    Slider
} from '../../shared';

import iconPlay from '../../shared/icons/music_play.png';
import iconPlayCircle from '../../shared/icons/music_play_circle.png';
import iconPause from '../../shared/icons/music_pause.png';
import iconPauseCircle from '../../shared/icons/music_pause_circle.png';
import iconStopCircle from '../../shared/icons/music_stop_circle.png';
import iconNext from '../../shared/icons/music_next.png';
import iconPrev from '../../shared/icons/music_prev.png';
import iconVolume from '../../shared/icons/icon_volume.png';

import { AudioTrackType } from '../../store/music/types'; 

import _ from 'lodash';

interface PropsType {
    currentTrack: AudioTrackType,
    trackList: AudioTrackType[],
    selectTrack: Function
}

interface StateType {
    currentTime: number,
    endTime: number,
    mousePressed: boolean,
    volume: number
}

class AudioPlayer extends React.Component <PropsType, StateType> {
    audio: any;
    constructor(props: PropsType) {
        super(props);
        this.audio = new Audio("");
        this.state = {
            currentTime: 0,
            endTime: 0,
            mousePressed: false,
            volume: 100
        }
    }

    componentDidMount() {
        let volume = localStorage.getItem("audio_volume");

        if (!volume) {
            this.setVolume(50);
            volume = "0.5";
        }

        this.setState({ volume: +volume * 100 });
        this.audio.addEventListener("timeupdate", () => {
            if (this.state.mousePressed) return;

            this.setState({ currentTime: this.audio.currentTime });
        });
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.currentTrack === this.props.currentTrack) {
            return;
        }

        this.stopMusic();
        this.audio = null;
        this.audio = new Audio(this.props.currentTrack.url);
        this.audio.volume = this.state.volume / 100;

        this.audio.addEventListener("loadedmetadata", () => {
            this.setState({ endTime: this.audio.duration });
            this.playMusic();
        }, { once: true });

        this.audio.ontimeupdate = () => this.updateProgressBar();
        this.audio.onended = () => this.switchTrack("next");
    }

    componentWillUnmount() {
        this.stopMusic();
        this.audio = null;
    }

    updateProgressBar = () => {
        if (this.state.mousePressed) return;

        this.setState({ currentTime: this.audio.currentTime });
    }

    playMusic = () => {
        if (!this.props.currentTrack.id) return;

        this.audio.play();
    }

    pauseMusic = () => {
        this.audio.pause();
    }

    stopMusic = () => {
        this.audio.pause();
        this.audio.currentTime = 0.0;
    };

    setVolume = (value: number) => {
        localStorage.setItem("audio_volume", `${value / 100}`);
        this.setState({ volume: value });
        this.audio.volume = localStorage.getItem("audio_volume");
    }

    setAudioTime = (time: number) => {
        const ms = Math.floor(time * 1000);
        const date = new Date(ms);

        let minutes = date.getMinutes();
        let seconds = `${date.getSeconds()}`;
        if (seconds.length < 2) seconds = `0${seconds}`;

        return `${minutes}:${seconds}`;
    }

    switchTrack = (direction: string) => {
        this.stopMusic();

        const currentTrackIndex = _.findIndex(this.props.trackList, { id: this.props.currentTrack.id });
        const lastTrackIndex = this.props.trackList.length - 1;

        if (
            currentTrackIndex === 0 && direction === "back" ||
            currentTrackIndex === lastTrackIndex && direction === "next"
        ) {
            return;
        }

        const newIndex = direction === "back" ? currentTrackIndex - 1 :
                         direction === "next" ? currentTrackIndex + 1 : 0;
        const newTrack = this.props.trackList[newIndex];
        
        this.props.selectTrack({ 
            ...newTrack, 
            url: '/api/audio/' + newTrack.url
        });
    }

    render() {
        const { artist, name } = this.props.currentTrack;
        return (
            <div className={styles.AudioPlayer}>
                <div className={styles.track_info}>
                    {artist} - <strong>{name}</strong>
                </div>

                <Slider width={520}
                    min={0} 
                    max={this.state.endTime}
                    thumbAutoHide
                    value={this.state.currentTime}
                    onChange={(e: any) => {
                        this.setState({ currentTime: e.target.value });
                    }}
                    onMouseDown={() => {
                        this.setState({ mousePressed: true });
                    }}
                    onMouseUp={() => {
                        this.audio.currentTime = this.state.currentTime;
                        this.setState({ mousePressed: false });
                    }}
                />

                <div className={styles.control_bar}>
                    <span className={styles.progress}>
                        {this.setAudioTime(this.state.currentTime)} / 
                        {this.setAudioTime(this.state.endTime)}
                    </span>

                    <div>
                        <IconButton size="small" onClick={() => this.switchTrack("back")}>
                            <img src={iconPrev} width={10} height={10} />
                        </IconButton>

                        {this.audio.paused && <IconButton onClick={this.playMusic}>
                            <img src={iconPlayCircle} width={24} height={24} />
                        </IconButton>}

                        {!this.audio.paused && <IconButton onClick={this.pauseMusic}>
                            <img src={iconPauseCircle} width={24} height={24} />
                        </IconButton>}

                        <IconButton onClick={this.stopMusic}>
                            <img src={iconStopCircle} width={24} height={24} />
                        </IconButton>

                        <IconButton size="small" onClick={() => this.switchTrack("next")}>
                            <img src={iconNext} width={10} height={10} />
                        </IconButton>
                    </div>

                    <div className={styles.volume}>
                        <img src={iconVolume} width={12} height={12} />

                        <Slider width={80} 
                            max={100}
                            step={2}
                            tip={`${this.state.volume}%`}
                            value={this.state.volume}
                            onChange={(e: any) => this.setVolume(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        );
    }
    
}

export default AudioPlayer;
