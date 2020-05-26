import React from 'react';
import styles from './styles/Note.m.css';
import { IconButton, Icon } from '../../shared';

interface Props {
    header: string,
    content: string,
    open: () => void,
    delete: () => void
}

const Note = (props: Props) => {
    return (
        <div className={styles.Note}>
            <div className={styles.header}>
                <span>{props.header}</span>
                
                <div className={styles.delete_button}>
                    <IconButton size="very_small" onClick={props.delete}>
                        <Icon img="cross" color="gray" size="very_small" />
                    </IconButton>
                </div>
            </div>
            
            <p className={styles.content} onClick={props.open}>
                {props.content}
            </p>
        </div>
    );
}

export default Note;
