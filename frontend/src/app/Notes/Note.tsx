import React from 'react';
import styles from './Styles.m.css';

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
