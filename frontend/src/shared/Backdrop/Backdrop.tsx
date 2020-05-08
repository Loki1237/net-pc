import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    isOpened: boolean,
    blackout?: boolean,
    children?: React.ReactElement,
    onClose?: VoidFunction
}

interface State {
    isOpened?: boolean,
    show?: boolean
}

class Backdrop extends React.Component<Props, State> {
    private backdropElement: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            document.addEventListener("keydown", this.keyboarHandler);
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            document.removeEventListener("keydown", this.keyboarHandler);
        }
    }

    keyboarHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case "Escape":
                if (this.props.onClose) {
                    this.props.onClose();
                }
                break;
        }
    }

    clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.props.onClose) {
            return;
        } else if (e.target === this.backdropElement.current) {
            this.props.onClose();
        }
    }

    render() {
        const backdropClassNames = classNames({
            [styles.Backdrop]: true,
            [styles.blackout]: this.props.blackout,
            [styles.closed]: !this.props.isOpened
        });

        return (
            <div ref={this.backdropElement}
                className={backdropClassNames}
                onClick={this.clickHandler}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Backdrop;
