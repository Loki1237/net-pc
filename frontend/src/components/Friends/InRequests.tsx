import React from 'react';
import styles from './Styles.m.css';

import User from './User';
import { InRequest } from '../../store/Friends/types';
import { Button, TextArea, Loading, LoadingError } from '../../shared';

interface Props {
    isLoading: boolean,
    error: string,
    inRequestList: InRequest[],
    updateInRequestList: () => void,
    confirmRequest: (id: number) => void,
    deleteRequest: (id: number) => void,
    resetState: () => void
}

class InRequests extends React.Component<Props> {
    componentDidMount() {
        this.props.updateInRequestList();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    confirmRequest = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.preventDefault();
        this.props.confirmRequest(id);
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
                {this.props.inRequestList.map(request => (
                    <User key={request.id}
                        id={request.user1.id}
                        firstName={request.user1.firstName}
                        lastName={request.user1.lastName}
                        avatar={request.user1.avatar}
                        online={request.user1.online}
                    >
                        <Button color="primary"
                            size="small" 
                            onClick={(e) => this.confirmRequest(e, request.id)}
                        >
                            Принять
                        </Button>

                        <Button color="info"
                            size="small" 
                            style={{ marginLeft: 12 }}
                            onClick={(e) => this.deleteRequest(e, request.id)}
                        >
                            Отклонить
                        </Button>
                    </User>
                ))}
            </div>
        );
    }
}

export default InRequests;
