import React from 'react';
import styles from './Alert.css';
import info from '../icons/message_info.png';
import success from '../icons/message_success.png';
import warning from '../icons/message_warning.png';
import error from '../icons/message_error.png';

const icons = { info, success, warning, error };

class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            idOpened: false,
            show: false
        };
    }

    setTimer = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.setState({ show: false });
            setTimeout(this.close, 100);
        }, this.props.autoHideDuration);
    }

    close = () => {
        this.setState({ show: false });
        setTimeout(() => {
            this.props.onClose();
            clearTimeout(this.timer);
            this.timer = null;
        }, 100);
    }

    update = () => {
        this.setState({ show: false });
        setTimeout(() => {
            this.setState({ show: true });
        }, 200);
    }

    componentDidUpdate(prevProps) {
        const open = this.props.open;

        if (open !== prevProps.open && open === true) {
            this.setState({ isOpened: true });
            setTimeout(() => {
                this.setState({ show: true });
            }, 0);
        } else if (open !== prevProps.open && open === false) {
            this.setState({ isOpened: false });
        } else if (open === prevProps.open && this.props.timestamp !== prevProps.timestamp) {
            this.update();
        }
    }

    render() {
        if (this.state.isOpened) {
            this.setTimer();

            return (
                <div 
                    className={`${styles.Alert} ${styles[`${this.props.type}`]}
                        ${this.state.show && styles.open}`}
                    align="right"
                >
                    <div className={styles.badge}>
                        <img src={icons[`${this.props.type}`]} width="22" height="22" />
                    </div>
                    
                    <div className={styles.content} align="left">
                        <span>{this.props.children}</span>
                    </div>

                    <button className={`${styles["close-button"]} ${styles[`${this.props.type}-close`]}`}
                        onClick={this.close}>
                    </button>
                </div>
            );
        } else {
            return "";
        }
    }
}

export default Alert;
