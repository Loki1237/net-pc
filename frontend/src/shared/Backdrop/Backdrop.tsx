import React from 'react';
import styles from './Styles.m.css';

interface PropsType {
    isOpened: boolean,
    blackout?: boolean,
    children?: any,
    onClose?: VoidFunction
}

interface StateType {
    isOpened: boolean,
    show: boolean
}

class Backdrop extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            isOpened: false,
            show: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: PropsType) {
        if (nextProps.isOpened !== this.props.isOpened) {
            switch (nextProps.isOpened) {
                case true:
                    setTimeout(() => this.setState({ isOpened: true }), 5);
                    setTimeout(() => this.setState({ show: true }), 50);
                    break;

                case false:
                    setTimeout(() => this.setState({ show: false }), 5);
                    setTimeout(() => this.setState({ isOpened: false }), 210);
                    break;
            }
            
        }
    }

    render() {
        if (this.state.isOpened) return (
            <div id="backdrop-elem-id"
                className={`${styles.Backdrop} 
                    ${this.state.show && this.props.blackout ? styles.opened : ""}`}
                onClick={(e: any) => {
                    if (!this.props.onClose) {
                        return;
                    } else if (e.target.id === "backdrop-elem-id") {
                        this.props.onClose();
                    }
                }}
            >
                {React.cloneElement(this.props.children, {
                    open: this.state.show
                })}
            </div>
        );

        return "";
    }
}

export default Backdrop;