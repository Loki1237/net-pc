import React from 'react';
import styles from './Styles.m.css';

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
            <div 
                className={`${styles.InputField}
                    ${this.props.labelPlacement === "top" ? styles.column_dir : ""}    
                `}
                style={{
                    width: this.props.width || 340,
                    ...this.props.style
                }}
            >

                {this.props.label && <span 
                    className={`${styles.label}
                        ${this.state.focus ? styles['label-focus'] : ""}`}>
                    {this.props.label}
                </span>}
                
                <div className={styles['input-container']}>
                    <input type={this.state.type} 
                        autoComplete="off"
                        autoFocus={this.props.autoFocus}
                        maxLength={this.props.maxLength}
                        readOnly={this.props.readOnly}
                        className={`${styles.input}
                            ${this.props.highlighting ? styles.highlighting : ""}
                            ${this.props.outline ? styles.outline : ""}`}
                        value={this.props.value}
                        onChange={this.props.onChange} 
                        onFocus={() => this.setState({ focus: true })}
                        onBlur={() => this.setState({ focus: false })}
                    />
                    {!this.props.outline && <div className={styles.border}></div>}
                    
                    <div className={styles.icon_container}>
                        {this.props.type === "password" && <div className={styles.eye}
                            onClick={() => {
                                this.setState({ type: this.state.type === "text" ? "password" : "text" });
                            }}>
                            {this.state.type === "password" && <div className={styles["eye-slash"]}></div>}
                        </div>}

                        {this.props.type !== "password" && this.props.icon}
                    </div>
                </div>
            </div>
        );
    }
}

export default InputField;
