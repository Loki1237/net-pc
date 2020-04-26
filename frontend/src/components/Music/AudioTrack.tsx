import React from 'react';
import styles from './Styles.m.css';
import IconButton from '../../shared/IconButton/IconButton';
import iconPlay from '../../shared/icons/music_play.png';
import iconCross from '../../shared/icons/icon_cross_gray.png';
import iconEdit from '../../shared/icons/icon_edit_gray.png';

interface PropsType {
    artist: string,
    name: string,
    url: string,
    duration: string,
    selected: boolean,
    play: VoidFunction,
    delete?: VoidFunction,
    rename?: VoidFunction
}

const AudioTrack = (props: PropsType) => {
    return (
        <div className={`${styles.AudioTrack}
            ${props.selected ? styles.selected : ""}`}
        >
            <div className={styles.data} 
                onClick={props.play}
            >
                <img src={iconPlay} width={12} height={12} />

                <div>
                    <span>{props.name}</span>
                    <span>{props.artist}</span>
                </div>

                <span className={styles.track_duration}>
                    {props.duration}
                </span>
            </div>

            <div className={styles.buttons} onClick={props.rename}>
                <IconButton size="small">
                    <img src={iconEdit} width={12} height={12} />
                </IconButton>

                <IconButton size="small" onClick={props.delete}>
                    <img src={iconCross} width={12} height={12} />
                </IconButton>
            </div>
        </div>
    );
}

export default AudioTrack;
