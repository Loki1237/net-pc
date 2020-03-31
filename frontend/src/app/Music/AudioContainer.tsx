import React from 'react';
import styles from './Styles.m.css';
import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import DropdownContainer from '../../components/Dropdown/DropdownContainer';
import DropdownMenu from '../../components/Dropdown/DropdownMenu';
import DropdownItem from '../../components/Dropdown/DropdownItem';
import Divider from '../../components/Divider/Divider';
import InputField from '../../components/InputField/InputField';
import Loading from '../../components/Loading/Loading';
import Select from '../../components/Select/Select';

import AudioTrack from './AudioTrack';
import AudioTrackType from '../../types/AudioTrackType'; 

import { getMyId } from '../middleware';
import { toast as notify } from 'react-toastify';

interface PropsType {
    currentTrack: AudioTrackType,
    trackList: AudioTrackType[],
    selectTrack: Function,
    setTrackList: Function
}

interface StateType {
    
}

class AudioContainer extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            
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

    deleteSong = async (id: number) => {
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
                        delete={() => this.deleteSong(track.id)}
                    />
                ))}
            </div>
        );
    }
}

export default AudioContainer;
