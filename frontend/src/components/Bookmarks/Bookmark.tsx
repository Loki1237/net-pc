import React from 'react';
import styles from './styles/Bookmark.m.css';
import classNames from 'classnames';
import { Icon } from '../../shared';

interface Props {
    type?: string,
    name?: string,
    url?: string,
    children?: React.ReactNode,
    onClick?: () => void
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
            {props.name && props.url && <img className={styles.icon}
                src={`https://plus.google.com/_/favicon?domain_url=${props.url}`} 
            />}

            {props.name && props.url && <div className={styles.data}>
                <p className={styles.name}>{props.name}</p>
                <a className={styles.url} href={props.url}>{props.url}</a>
            </div>}

            <div className={styles.buttons}>
                {props.children}
            </div>

            {props.type === "new" && <Icon img="plus" color="gray" size="very_large" />}
        </div>
    );
}

export default Bookmark;
