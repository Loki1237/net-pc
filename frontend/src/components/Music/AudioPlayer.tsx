import React from 'react';
import styles from './Styles.m.css';

import {
    Icon,
    IconButton,
    Slider
} from '../../shared';

import { Audio } from '../../store/Music/types'; 
import _ from 'lodash';

interface Props {
    currentTrack: Audio,
    trackList: Audio[],
    selectTrack: Function
}

interface State {
    currentTime: number,
    endTime: number,
    mousePressed: boolean,
    volume: number
}

class AudioPlayer extends React.Component<Props, State> {
    audio: HTMLAudioElement;
    constructor(props: Props) {
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

    componentDidUpdate(prevProps: Props) {
        if (prevProps.currentTrack === this.props.currentTrack) {
            return;
        }

        this.stopMusic();
        this.audio = new Audio("");
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
        this.audio = new Audio("");
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
        let newVolume = localStorage.getItem("audio_volume") || 0.5;
        this.audio.volume = +newVolume;
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
                            <Icon img="music_prev" size="small" />
                        </IconButton>

                        {this.audio.paused && <IconButton onClick={this.playMusic}>
                            <Icon img="music_play_circle" size="large" />
                        </IconButton>}

                        {!this.audio.paused && <IconButton onClick={this.pauseMusic}>
                            <Icon img="music_pause_circle" size="large" />
                        </IconButton>}

                        <IconButton size="small" onClick={this.stopMusic}>
                            <Icon img="music_stop" size="small" />
                        </IconButton>

                        <IconButton size="small" onClick={() => this.switchTrack("next")}>
                            <Icon img="music_next" size="small" />
                        </IconButton>
                    </div>

                    <div className={styles.volume}>
                        <Icon img="volume" size="small" />

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
