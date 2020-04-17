import React from 'react';
import styles from './Styles.m.css';

import IconButton from '../../shared/IconButton/IconButton';

import iconCrossGray from '../../shared/icons/icon_cross_gray.png';

interface Props {
    header?: string,
    content?: string,
    plus?: boolean,
    onClick?: any,
    open?: any,
    delete?: any
}

const Note = (props: Props) => {
    return (
        <div 
            className={`${styles.Note} 
                ${props.plus && styles.plus}`}
            onClick={props.onClick}
        >
            {props.header && <div className={styles.header}>
                <span className={styles.name}>
                    {props.header}
                </span>
                
                <IconButton size="very_small" onClick={props.delete}>
                    <img src={iconCrossGray} width={8} height={8} />
                </IconButton>
            </div>}
            
            {props.content && <p className={styles.content}
                onClick={props.open}
            >
                {props.content}
            </p>}
        </div>
    );
}

export default Note;
