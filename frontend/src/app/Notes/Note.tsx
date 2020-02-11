import React from 'react';
import styles from './Note.css';

interface Props {
    header?: string,
    content?: string,
    plus?: boolean,
    children?: any
}

const Note = (props: Props) => {
    return (
        <div 
            className={`${styles.Note} 
                ${props.plus && styles.plus}`}
        >
            {props.header && <p className={styles.header}
                title={props.header}
            >
                {props.header}
            </p>}
            
            {props.content && <p className={styles.content}>
                {props.content}
            </p>}

            {props.children}
        </div>
    );
}

export default Note;
