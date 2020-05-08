import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    width?: number,
    label?: string,
    children?: React.ReactNode,
    onHide?: () => void
}

interface State {
    showContent?: boolean,
    maxHeight?: number,
    currentHeight?: number,
}

class Spoiler extends React.Component<Props, State> {
    contentElement: React.RefObject<HTMLDivElement> = React.createRef();
    state = {
        showContent: false,
        maxHeight: 0,
        currentHeight: 0
    };

    componentDidMount() {
        let height = 0;

        if (this.contentElement.current) {
            height = this.contentElement.current.scrollHeight;
        }
        
        this.setState({ maxHeight: height });
    }

    clickHandler = () => {
        const { showContent, maxHeight, currentHeight } = this.state;

        if (!showContent && this.props.onHide) {
            this.props.onHide();
        }

        this.setState({ 
            showContent: !showContent, 
            currentHeight: currentHeight === 0 ? maxHeight : 0
        });
    }

    render() {
        const arrowClassNames = classNames({
            [styles.icon_arrow]: true,
            [styles.icon_arrow_active]: this.state.showContent
        });

        return (
            <div className={styles.Spoiler}
                style={{ width: this.props.width || 340 }}
            >
                <div className={styles.label}
                    onClick={this.clickHandler}
                >
                    <span>{this.props.label}</span>
                    <div className={arrowClassNames}></div>
                </div>

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

export default Spoiler;
