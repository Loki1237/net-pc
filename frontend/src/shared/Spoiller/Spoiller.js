import React from 'react';
import styles from './Styles.m.css';

class Collapse extends React.Component {
    constructor(props) {
        super(props);
        this.contentElement = React.createRef();
        this.state = {
            showContent: false,
            maxHeight: 0,
            currentHeight: 0
        };
    }

    componentDidMount() {
        const height = this.contentElement.current.scrollHeight;
        this.setState({ maxHeight: height });
    }

    clickHandler = () => {
        const { showContent, maxHeight, currentHeight } = this.state;

        if (!showContent) {
            this.props.onHide();
        }

        this.setState({ 
            showContent: !showContent, 
            currentHeight: currentHeight === 0 ? maxHeight : 0
        });
    }

    render() {
        return (
            <div 
                className={`${styles.Collapse}
                    ${this.state.showContent ? styles.opened : ""}
                `}
                style={{ width: this.props.width || 340 }}
            >
                <p className={styles.label}
                    onClick={this.clickHandler}
                >
                    {this.props.label}
                    <span className={`${styles.icon_arrow} 
                        ${this.state.showContent ? styles.icon_arrow_active : ""}
                    `}>
                    </span>
                </p>

                <div ref={this.contentElement}
                    className={styles.content}
                    style={{
                        height: this.state.currentHeight,
                        padding: `${this.state.showContent ? "8px" : 0} 8px`,
                        transition: `all ${this.state.maxHeight ** 0.3 * 0.06}s linear`
                    }}
                >
                    <div className={styles.border}></div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Collapse;
