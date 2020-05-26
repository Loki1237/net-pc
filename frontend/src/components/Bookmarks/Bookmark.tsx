import React from 'react';
import styles from './styles/Bookmark.m.css';
import { Icon, IconButton } from '../../shared';

interface Props {
    name: string,
    url: string,
    edit: () => void,
    delete: () => void
}

const Bookmark = (props: Props) => {
    return (
        <div className={styles.Bookmark}>
            <img className={styles.icon}
                src={`https://plus.google.com/_/favicon?domain_url=${props.url}`} 
            />

            <div className={styles.data}>
                <p className={styles.name}>{props.name}</p>
                <a className={styles.url} href={props.url}>{props.url}</a>
            </div>

            <div className={styles.buttons}>
                <IconButton size="small" onClick={props.edit}>
                    <Icon img="edit" color="gray" size="small" />
                </IconButton>

                <IconButton size="small" onClick={props.delete}>
                    <Icon img="cross" color="gray" size="small" />
                </IconButton>
            </div>
        </div>
    );
}

export default Bookmark;
