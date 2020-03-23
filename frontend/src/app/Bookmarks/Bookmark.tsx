import React from 'react';
import styles from './styles/Bookmark.m.css';

interface Props {
    name?: string,
    url?: string,
    children?: any
}

const Bookmark = (props: Props) => {
    return (
        <div className={styles.Bookmark}>
            {props.name && props.url && <img className={styles.icon}
                src={`https://plus.google.com/_/favicon?domain_url=${props.url}`} 
            />}

            {props.name && props.url && <div className={styles.data}>
                <p className={styles.name}>{props.name}</p>
                <a className={styles.url} href={props.url}>{props.url}</a>
            </div>}

            <div className={props.name && props.url ? styles.buttons : styles.plus}>
                {props.children}
            </div>
        </div>
    );
}

export default Bookmark;
