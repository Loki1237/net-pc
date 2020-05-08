import React from 'react';
import styles from './Styles.m.css';

import AboutSelf from './AboutSelf';
import BasicData from './BasicData';
import Settings from './Settings';

interface Props {
    userId: number,
    urlParam: string
}

const Editing = (props: Props) => {
    switch (props.urlParam) {
        case 'basic':
            return <BasicData userId={props.userId} />

        case 'about_self':
            return <AboutSelf userId={props.userId} />

        case 'settings':
            return <Settings userId={props.userId} />

        default:
            return (
                <div className={styles.Settings}>
                    <h1>Not found</h1>
                </div>
            );
    }
}

export default Editing;
