import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';
import { Icon, IconButton } from '../../shared';

interface Props {
    artist: string,
    name: string,
    url: string,
    duration: string,
    selected: boolean,
    play: () => void,
    delete?: () => void,
    rename?: () => void
}

const AudioTrack = (props: Props) => {
    const trackClassNames = classNames({
        [styles.AudioTrack]: true,
        [styles.selected]: props.selected
    });

    return (
        <div className={trackClassNames}>
            <div className={styles.data} 
                onClick={props.play}
            >
                <Icon img="music_play" size="small" />

                <div>
                    <span>{props.name}</span>
                    <span>{props.artist}</span>
                </div>

                <span className={styles.track_duration}>
                    {props.duration}
                </span>
            </div>

            <div className={styles.buttons}>
                <IconButton size="small" onClick={props.rename}>
                    <Icon img="edit" color="gray" size="small" />
                </IconButton>

                <IconButton size="small" onClick={props.delete}>
                    <Icon img="cross" color="gray" size="small" />
                </IconButton>
            </div>
        </div>
    );
}

export default AudioTrack;
