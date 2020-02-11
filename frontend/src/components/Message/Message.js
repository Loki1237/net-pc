import React from 'react';
import styles from './Message.css';
import info from '../icons/message_info.png';
import success from '../icons/message_success.png';
import warning from '../icons/message_warning.png';
import error from '../icons/message_error.png';

const icons = { info, success, warning, error };

class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.open) {
            return (
                <div className={`${styles.Message} ${styles[`${this.props.type}`]}`}
                    align="right">

                    <div className={styles.badge}>
                        <img src={icons[`${this.props.type}`]} width="22" height="22" />
                    </div>
                    
                    <div className={styles.content} align="left">
                        <span>{this.props.text}</span>
                    </div>

                    <button className={`${styles["close-button"]} ${styles[`${this.props.type}-close`]}`}
                        onClick={() => {
                            this.props.onClose();
                        }}>
                    </button>
                </div>
            );
        } else {
            return "";
        }
    }
}

export default Message;
