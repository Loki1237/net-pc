import React from 'react';
import styles from './styles/Playlist.m.css';
import { Icon } from '../../shared';

interface Props {
    name: string,
    discription: string,
    onClick: () => void
}

const Playlist = (props: Props) => {
    return (
        <div className={styles.Playlist} onClick={props.onClick}>
            <Icon img="playlist" size="very_large" />
            
            <div className={styles.name}>
                <p>{props.name}</p>
            </div>
        </div>
    );
}

export default Playlist;
