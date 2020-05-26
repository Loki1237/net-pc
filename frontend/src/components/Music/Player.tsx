import React from 'react';
import styles from './styles/Player.m.css';

import {
    Icon,
    IconButton,
    Slider
} from '../../shared';

import { Audio, CurrentTrack } from '../../store/Music/types';
import _ from 'lodash';

interface Props {
    currentTrack: CurrentTrack,
    trackList: Audio[],
    setTrackAndPlay: (track: Audio) => void,
    setCurrentTrackStatus: (status: string) => void
}

class Player extends React.Component<Props> {
    audio: HTMLAudioElement = new Audio("");
    state = {
        currentTime: 0,
        endTime: 0,
        mousePressed: false,
        volume: 100
    }

    componentDidMount() {
        let volume = localStorage.getItem("audio_volume");

        if (!volume) {
            this.setVolume(50);
            volume = "0.5";
        }

        this.setState({ volume: +volume * 100 });
    }

    updateCurrentTime = () => {
        if (this.state.mousePressed) return;

        this.setState({ currentTime: this.props.currentTrack.audioFile.currentTime });
    }

    setCurrentTrackPlayingStatus = () => {
        this.props.setCurrentTrackStatus("playing");
    }

    setCurrentTrackPausedStatus = () => {
        this.props.setCurrentTrackStatus("paused");
    }

    componentDidUpdate(prevProps: Props) {
        const currentAudioFile = this.props.currentTrack.audioFile;

        if (currentAudioFile !== prevProps.currentTrack.audioFile) {
            currentAudioFile.addEventListener("timeupdate", this.updateCurrentTime);
            currentAudioFile.addEventListener("play", this.setCurrentTrackPlayingStatus);
            currentAudioFile.addEventListener("pause", this.setCurrentTrackPausedStatus);
            currentAudioFile.addEventListener("ended", () => this.switchTrack("next"));
            currentAudioFile.addEventListener("loadedmetadata", () => {
                this.setState({ endTime: currentAudioFile.duration })
            }, { once: true });

            this.props.currentTrack.audioFile.volume = this.state.volume / 100;
        }
    }

    componentWillUnmount() {
        const currentAudioFile = this.props.currentTrack.audioFile;
        currentAudioFile.removeEventListener("timeupdate", this.updateCurrentTime);
        currentAudioFile.removeEventListener("play", this.setCurrentTrackPlayingStatus);
        currentAudioFile.removeEventListener("pause", this.setCurrentTrackPausedStatus);
    }

    updateProgressBar = () => {
        if (this.state.mousePressed) return;

        this.setState({ currentTime: this.audio.currentTime });
    }

    playMusic = () => {
        if (!this.props.currentTrack.data.id) return;

        this.props.currentTrack.audioFile.play();
    }

    pauseMusic = () => {
        this.props.currentTrack.audioFile.pause();
    }

    stopMusic = () => {
        this.props.currentTrack.audioFile.pause();
        this.props.currentTrack.audioFile.currentTime = 0.0;
    };

    progressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ currentTime: e.target.value });
    }

    setAudioProgress = () => {
        this.props.currentTrack.audioFile.currentTime = this.state.currentTime;
        this.setState({ mousePressed: false });
    }

    setVolume = (value: number) => {
        localStorage.setItem("audio_volume", `${value / 100}`);
        this.setState({ volume: value });
        let newVolume = localStorage.getItem("audio_volume") || 0.5;
        this.props.currentTrack.audioFile.volume = +newVolume;
    }

    setAudioTime = (time: number) => {
        const ms = Math.floor(time * 1000);
        const date = new Date(ms);

        let minutes = date.getMinutes();
        let seconds = `${date.getSeconds()}`;
        if (seconds.length < 2) seconds = `0${seconds}`;

        return `${minutes}:${seconds}`;
    }

    switchTrack = (direction: "back" | "next") => {
        this.stopMusic();

        const currentTrackIndex = _.findIndex(this.props.trackList, { id: this.props.currentTrack.data.id });
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
        
        this.props.currentTrack.audioFile.pause();
        this.props.setTrackAndPlay(newTrack);
    }

    render() {
        const { artist, name } = this.props.currentTrack.data;

        return (
            <div className={styles.AudioPlayer}>
                <div className={styles.control_buttons}>
                    <IconButton size="small" onClick={() => this.switchTrack("back")}>
                        <Icon img="music_prev" size="small" />
                    </IconButton>

                    {this.props.currentTrack.audioFile.paused && 
                        <IconButton onClick={this.playMusic}>
                            <Icon img="music_play_circle" size="large" />
                        </IconButton>
                    }

                    {!this.props.currentTrack.audioFile.paused && 
                        <IconButton onClick={this.pauseMusic}>
                            <Icon img="music_pause_circle" size="large" />
                        </IconButton>
                    }

                    <IconButton size="small" onClick={this.stopMusic}>
                        <Icon img="music_stop" size="small" />
                    </IconButton>

                    <IconButton size="small" onClick={() => this.switchTrack("next")}>
                        <Icon img="music_next" size="small" />
                    </IconButton>
                </div>

                <div className={styles.progress_bar}>
                    <div className={styles.track_info}>
                        <span>
                            {artist} - <strong>{name}</strong>
                        </span>

                        <span className={styles.progress}>
                            {this.setAudioTime(this.state.currentTime)} / {this.setAudioTime(this.state.endTime)}
                        </span>
                    </div>

                    <Slider width={500}
                        min={0} 
                        max={this.state.endTime}
                        thumbAutoHide
                        value={this.state.currentTime}
                        onChange={this.progressChange}
                        onMouseDown={() => this.setState({ mousePressed: true })}
                        onMouseUp={this.setAudioProgress}
                    />
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
        );
    }
    
}

export default Player;
