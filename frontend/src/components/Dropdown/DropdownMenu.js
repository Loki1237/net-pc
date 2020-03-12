import React from 'react';
import styles from './Dropdown.css';

class DropdownMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            classOpened: false
        };
    }

    componentDidUpdate(prewProps) {
        if (this.props.open && this.props.open !== prewProps.open) {
            this.setState({ isOpened: true });
            setTimeout(() => {
                this.setState({ classOpened: true });
            }, 5);
            document.addEventListener("click", this.props.onClose, { once: true });
        } else if (!this.props.open && this.props.open !== prewProps.open) {
            this.setState({ classOpened: false });
            setTimeout(() => {
                this.setState({ isOpened: false });
            }, 100);
        }
    }

    render() {
        return this.state.isOpened 
            ? (
                <div 
                    className={`${styles.DropdownMenu}
                        ${this.state.classOpened && styles.opened}`}
                    style={this.props.placement  
                        ? { [this.props.placement]: 0 }
                        : { left: 0 }
                    }
                    onClick={this.props.onClose}
                >
                    {this.props.arrow && <div className={styles.arrow}
                        style={this.props.arrow}
                    >
                    </div>}
                    
                    {this.props.children}
                </div>
            )
            : null
        ;
    }
}

export default DropdownMenu;
