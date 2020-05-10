import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';
import { IconButton, Icon } from '../../shared';

interface Props {
    type?: string,
    header?: string,
    content?: string,
    onClick?: () => void,
    open?: () => void,
    delete?: () => void
}

const Note = (props: Props) => {
    const noteClassNames = classNames({
        [styles.Note]: true,
        [styles.new_note]: props.type === "new"
    });

    return (
        <div className={noteClassNames}
            onClick={props.onClick}
        >
            {props.header && <div className={styles.header}>
                <span className={styles.name}>
                    {props.header}
                </span>
                
                <IconButton size="very_small" onClick={props.delete}>
                    <Icon img="cross" color="gray" size="very_small" />
                </IconButton>
            </div>}
            
            {props.content && <p className={styles.content}
                onClick={props.open}
            >
                {props.content}
            </p>}

            {props.type === "new" && <Icon img="plus" color="gray" size="extra_large" />}
        </div>
    );
}

export default Note;
