import React from 'react';
import styles from './styles/Track.m.css';
import classNames from 'classnames';
import { Icon, IconButton, DropdownMenu, DropdownItem } from '../../shared';

interface Props {
    name: string,
    url: string,
    duration: string,
    selected: boolean,
    playing: boolean,
    onClick: () => void,
    delete?: () => void,
    rename?: () => void
}

const Track = (props: Props) => {
    const trackClassNames = classNames({
        [styles.AudioTrack]: true,
        [styles.selected]: props.selected
    });

    return (
        <div className={trackClassNames}>
            <div className={styles.data}
                onClick={props.onClick}
            >
                <Icon img={props.playing ? "music_pause" : "music_play" } size="small" />

                <div className={styles.track_name}>
                    <p>{props.name}</p>
                </div>

                <span className={styles.track_duration}>
                    {props.duration}
                </span>
            </div>

            <DropdownMenu placement="right"
                arrow
                control={
                    <IconButton size="small">
                        <Icon img="more_vertical" color="gray" size="small" />
                    </IconButton>
                }
            >
                <DropdownItem onClick={props.rename}>
                    Редактировать
                </DropdownItem>

                <DropdownItem>
                    Добавить в плейлист
                </DropdownItem>

                <DropdownItem onClick={props.delete}>
                    Удалить
                </DropdownItem>
            </DropdownMenu>
        </div>
    );
}

export default Track;
