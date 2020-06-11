import React from 'react';
import styles from './Styles.m.css';

import { Tab, Tabs } from '../../shared';
import MyFriends from '../../containers/Friends/MyFriends';
import InRequests from '../../containers/Friends/InRequests';
import OutRequests from '../../containers/Friends/OutRequests';

interface Props {
    urlParam: string
}

const Friends = (props: Props) => {
    return (
        <div className={styles.Friends}>
            <Tabs>
                <Tab href="/friends/all" active={props.urlParam === "all"}>
                    Мои друзья
                </Tab>

                <Tab href="/friends/in_requests" active={props.urlParam === "in_requests"}>
                    Входящие заявки
                </Tab>

                <Tab href="/friends/out_requests" active={props.urlParam === "out_requests"}>
                    Исходящие заявки
                </Tab>
            </Tabs>

            {props.urlParam === "all" && <MyFriends />}
            {props.urlParam === "in_requests" && <InRequests />}
            {props.urlParam === "out_requests" && <OutRequests />}
        </div>
    );
}

export default Friends;
