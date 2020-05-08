import React from 'react';
import styles from './Styles.m.css';

import { Tabs, Tab } from '../../shared';
import { Link } from 'react-router-dom';

interface Props {
    urlParam: string
}

const CategoryTabs = (props: Props) => {
    const tabStyle = { padding: 0 }

    return (
        <div className={styles.CategoryTabs}>
            
            <Tabs direction="column" size="small">
                <Tab active={props.urlParam === 'basic'} style={tabStyle}>
                    <Link className={styles.link} to='/edit/basic'>
                        Основное
                    </Link>
                </Tab>

                <Tab active={props.urlParam === 'about_self'} style={tabStyle}>
                    <Link className={styles.link} to='/edit/about_self'>
                        О себе
                    </Link>
                </Tab>

                <Tab active={props.urlParam === 'settings'} style={tabStyle}>
                    <Link className={styles.link} to='/edit/settings'>
                        Настройки
                    </Link>
                </Tab>
            </Tabs>

        </div>
    );
}

export default CategoryTabs;
