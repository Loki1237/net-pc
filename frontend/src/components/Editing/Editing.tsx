import React from 'react';
import styles from './Styles.m.css';

import AboutSelf from '../../containers/Editing/AboutSelf';
import BasicData from '../../containers/Editing/BasicData';
import Settings from '../../containers/Editing/Settings';

import { Tabs, Tab } from '../../shared';

interface Props {
    urlParam: string
}

const Editing = (props: Props) => {
    return (
        <div className={styles.Editing}>
            <Tabs>
                <Tab href="/edit/basic" active={props.urlParam === "basic"}>
                    Основное
                </Tab>

                <Tab href="/edit/about_self" active={props.urlParam === "about_self"}>
                    О себе
                </Tab>

                <Tab href="/edit/settings" active={props.urlParam === "settings"}>
                    Настройки
                </Tab>
            </Tabs>

            {props.urlParam === "basic" && <BasicData />}
            {props.urlParam === "about_self" && <AboutSelf />}
            {props.urlParam === "settings" && <Settings />}
        </div>
    );
}

export default Editing;
