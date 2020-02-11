import React from 'react';
import styles from './InputField.css';

class InputField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "text",
            focus: false
        };
    }

    componentDidMount() {
        this.setState({ type: this.props.type });
    }

    render() {
        return (
            <div className={styles.InputField}
                style={this.props.style}>

                <span 
                    className={`${styles.fieldName}
                        ${this.state.focus ? styles['fieldName-focus'] : styles['fieldName-unFocus']}`}>
                    {this.props.name}
                </span>
                
                <div className={styles['input-container']}>
                    <input type={this.state.type} 
                        autoComplete="off"
                        autoFocus={this.props.autoFocus}
                        maxLength={this.props.maxLength}
                        style={this.props.style}
                        className={`${styles.input}
                            ${this.props.highlighting ? styles.highlighting : ""}`}
                        value={this.props.value}
                        onChange={this.props.onChange} 
                        onFocus={() => this.setState({ focus: true })}
                        onBlur={() => this.setState({ focus: false })}
                    />
                    <div className={styles.border}></div>
                </div>

                {this.props.type === "password" && <div className={styles.eye}
                    onClick={() => {
                        this.setState({ type: this.state.type === "text" ? "password" : "text" });
                    }}>
                    {this.state.type === "password" && <div className={styles["eye-slash"]}></div>}
                </div>}
            </div>
        );
    }
}

export default InputField;
