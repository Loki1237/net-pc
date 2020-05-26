import React from 'react';
import styles from './Styles.m.css';

import AboutSelf from '../../containers/Editing/AboutSelf';
import BasicData from '../../containers/Editing/BasicData';
import Settings from '../../containers/Editing/Settings';

interface Props {
    urlParam: string
}

const Editing = (props: Props) => {
    switch (props.urlParam) {
        case 'basic':
            return <BasicData />

        case 'about_self':
            return <AboutSelf />

        case 'settings':
            return <Settings />

        default:
            return (
                <div className={styles.Settings}>
                    <h1>Not found</h1>
                </div>
            );
    }
}

export default Editing;
