import React from 'react';
import styles from './Note.css';

import IconButton from '../../components/IconButton/IconButton';
import Tooltip from '../../components/Tooltip/Tooltip';

import iconEditGray from '../../components/icons/icon_edit_gray.png';

interface Props {
    header?: string,
    content?: string,
    plus?: boolean,
    children?: any,
    editMenu?: any
}

const Note = (props: Props) => {
    return (
        <div 
            className={`${styles.Note} 
                ${props.plus && styles.plus}`}
        >
            {props.header && <div className={styles.header}>
                <span className={styles.name}>
                    {props.header}
                </span>
                
                {props.editMenu}
            </div>}
            
            {props.content && <p className={styles.content}>
                {props.content}
            </p>}

            {props.children}
        </div>
    );
}

export default Note;
