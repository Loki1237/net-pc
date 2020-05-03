import React from 'react';
import styles from './Styles.m.css';

interface Props {
    isOpened: boolean,
    blackout?: boolean,
    children?: React.ReactElement,
    onClose?: VoidFunction
}

interface State {
    isOpened: boolean,
    show: boolean
}

class Backdrop extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpened: false,
            show: false
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpened !== prevProps.isOpened) {
            switch (this.props.isOpened) {
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

        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            document.addEventListener("keydown", this.keyboarHandler);
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            document.removeEventListener("keydown", this.keyboarHandler);
        }
    }

    keyboarHandler = (e: KeyboardEvent): void => {
        switch (e.key) {
            case "Escape":
                if (this.props.onClose) {
                    this.props.onClose();
                }
                break;
        }
    }

    clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;

        if (!this.props.onClose) {
            return;
        } else if (target.id === "backdrop-elem-id") {
            this.props.onClose();
        }
    }

    render() {
        if (this.state.isOpened) return (
            <div id="backdrop-elem-id"
                className={`${styles.Backdrop} 
                    ${this.state.show && this.props.blackout ? styles.opened : ""}`}
                onClick={this.clickHandler}
            >
                {this.props.children && React.cloneElement(this.props.children, {
                    open: this.state.show
                })}
            </div>
        );

        return "";
    }
}

export default Backdrop;