import React from 'react';
import styles from './Styles.m.css';

import User from './User';
import { OutRequest } from '../../store/Friends/types';
import { Button, TextArea, Loading, LoadingError } from '../../shared';

interface Props {
    isLoading: boolean,
    error: string,
    outRequestList: OutRequest[],
    updateOutRequestList: () => void,
    deleteRequest: (id: number) => void,
    resetState: () => void
}

class OutRequests extends React.Component<Props> {
    componentDidMount() {
        this.props.updateOutRequestList();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    deleteRequest = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.preventDefault();
        this.props.deleteRequest(id);
    }

    renderLoading = () => (
        <div className={styles.Friends}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Friends}>
            <LoadingError error={this.props.error} />
        </div>
    );

    render() {
        if (this.props.error) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.container}>
                {this.props.outRequestList.map(request => (
                    <User key={request.id}
                        id={request.user2.id}
                        firstName={request.user2.firstName}
                        lastName={request.user2.lastName}
                        avatar={request.user2.avatar}
                        online={request.user2.online}
                    >
                        <Button color="info"
                            size="small" 
                            onClick={(e) => this.deleteRequest(e, request.id)}
                        >
                            Отменить заявку
                        </Button>
                    </User>
                ))}
            </div>
        );
    }
}

export default OutRequests;
