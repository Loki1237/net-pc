import React from 'react';
import styles from './Styles.m.css';

interface PropsType {
    src: string,
    onClick: any
}

interface StateType {

}


class Photo extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <img className={styles.Photo}
                src={this.props.src}
                onClick={this.props.onClick}
            />
        );
    }
}

export default Photo;
