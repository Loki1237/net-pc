import React from 'react';
import styles from './Styles.m.css';

class Slider extends React.Component {
    state = {
        progress: 0
    }

    componentDidMount() {
        this.updateProgress();
    }

    componentDidUpdate(prevProps) {
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
        let p = this.state.progress;
    
        return (
            <div className={styles.Slider}
                style={{
                    width: this.props.width
                }}
                onMouseDown={() => this.setState({ showTip: true })}
                onMouseUp={() => this.setState({ showTip: false })}
            >
                <div className={styles.track}
                    style={{
                        background: `linear-gradient(to right, #808 ${p}%, #DDD ${p}%)`
                    }}
                >
                    <input type="range" 
                        className={`${styles.input}
                            ${this.props.thumbAutoHide ? styles.thumb_autohide : ""}
                        `}
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