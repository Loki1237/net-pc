import React from 'react';
import styles from './Styles.m.css';
import IconButton from '../../components/IconButton/IconButton';
import iconPlay from '../../components/icons/music_play.png';
import iconCross from '../../components/icons/icon_cross_gray.png';
import iconEdit from '../../components/icons/icon_edit_gray.png';

interface PropsType {
    artist: string,
    name: string,
    url: string,
    duration: string,
    selected: boolean,
    play: any,
    delete?: any
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

            <div className={styles.buttons}>
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
