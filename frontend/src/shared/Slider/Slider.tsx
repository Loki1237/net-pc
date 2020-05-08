import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    min?: number,
    max?: number,
    step?: number,
    width?: number,
    disabled?: boolean,
    value?: number,
    thumbAutoHide?: boolean,
    tip?: string,
    onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void,
    onMouseDown?: () => void,
    onMouseUp?: () => void
}

interface State {
    progress: number
}

class Slider extends React.Component<Props, State> {
    state = {
        progress: 0
    }

    componentDidMount() {
        this.updateProgress();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.value !== this.props.value) {
            this.updateProgress();
        }
    }

    updateProgress = () => {
        const max = this.props.max || 100;
        const value = this.props.value || 0;

        const percent = max / 100;
        this.setState({ progress: value / percent });
    }
  
    render() {
        let progress = this.state.progress;
        const inputElementClassNames = classNames({
            [styles.input]: true,
            [styles.thumb_autohide]: this.props.thumbAutoHide
        });
    
        return (
            <div className={styles.Slider}
                style={{ width: this.props.width }}
            >
                <div className={styles.track}
                    style={{
                        background: `linear-gradient(to right, #808 ${progress}%, #DDD ${progress}%)`
                    }}
                >
                    <input type="range" 
                        className={inputElementClassNames}
                        min={this.props.min}
                        max={this.props.max}
                        step={this.props.step}
                        disabled={this.props.disabled}
                        value={this.props.value}
                        onChange={this.props.onChange} 
                        onMouseDown={this.props.onMouseDown}
                        onMouseUp={this.props.onMouseUp}
                    />

                    {this.props.tip && <div className={styles.tip}
                        style={{ left: `${this.state.progress}%` }}
                    >
                        <div className={styles.tip_body}>
                            {this.props.tip}
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}
  
  export default Slider;