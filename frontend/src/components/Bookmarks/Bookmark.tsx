import React from 'react';
import styles from './styles/Bookmark.m.css';
import classNames from 'classnames';
import { Icon, IconButton } from '../../shared';

interface Props {
    type?: string,
    name?: string,
    url?: string,
    children?: React.ReactNode,
    onClick?: () => void,
    edit?: () => void,
    delete?: () => void
}

const Bookmark = (props: Props) => {
    const bookmarkClassNames = classNames({
        [styles.Bookmark]: true,
        [styles.new_bookmark]: props.type === "new"
    });

    return (
        <div className={bookmarkClassNames}
            onClick={props.onClick}
        >
            {props.type !== "new" && <img className={styles.icon}
                src={`https://plus.google.com/_/favicon?domain_url=${props.url}`} 
            />}

            {props.type !== "new" && <div className={styles.data}>
                <p className={styles.name}>{props.name}</p>
                <a className={styles.url} href={props.url}>{props.url}</a>
            </div>}

            {props.type !== "new" && <div className={styles.buttons}>
                <IconButton size="small" onClick={props.edit}>
                    <Icon img="edit" color="gray" size="small" />
                </IconButton>

                <IconButton size="small" onClick={props.delete}>
                    <Icon img="cross" color="gray" size="small" />
                </IconButton>
            </div>}

            {props.type === "new" && <Icon img="plus" color="gray" size="very_large" />}
        </div>
    );
}

export default Bookmark;
