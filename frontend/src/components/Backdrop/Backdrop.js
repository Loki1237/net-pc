import React from 'react';
import styles from './Backdrop.css';

class Backdrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            show: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
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
            <div id="8s2j0d7c4n"
                className={`${styles.Backdrop} 
                    ${this.state.show && styles.opened}`}
                onClick={(e) => {
                    if (e.target.id === "8s2j0d7c4n") this.props.onClose();
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