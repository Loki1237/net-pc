import React from 'react';
import styles from './Styles.m.css';

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown: false,
            showDropdown: false,
            focus: false
        };
    }

    showDropdown = () => {
        if (!this.state.dropdown) {
            this.setState({ dropdown: true });
            setTimeout(() => {
                this.setState({ showDropdown: true })
            }, 5);

            document.addEventListener("click", () => {
                this.setState({ showDropdown: false });
                setTimeout(() => {
                    this.setState({ dropdown: false })
                }, 205);
            }, { once: true });
        }
    }

    setFocus = (value) => {
        this.setState({ focus: value });
    }

    render() {
        return (
            <div
                className={`${styles.Select}
                    ${this.props.labelPlacement === "top" ? styles.column_dir : ""}    
                `}
                style={{ width: this.props.width }}
            >   
                {this.props.label && <span 
                    className={`${styles.label}
                        ${this.state.focus ? styles['label-focus'] : ""}`}>
                    {this.props.label}
                </span>}

                <div className={styles.control}>
                    <input className={`${styles.value}
                            ${this.props.outline ? styles.outline : ""}`}
                        readOnly
                        disabled={this.props.disabled}
                        value={this.props.selected.label}
                        onClick={this.showDropdown}
                        onFocus={() => this.setFocus(true)}
                        onBlur={() => this.setFocus(false)}
                    />   

                    {this.state.dropdown && <div
                        className={`${styles.option_container}
                            ${this.state.showDropdown ? styles.opened : ""}`}
                    >
                        
                        {this.props.options.map((option, index) => (
                            <span key={`option-${index}`}
                                className={`${styles.option}
                                    ${this.props.selected.value === option.value && this.state.focus
                                        ? styles.selected 
                                        : ""
                                    }
                                `}
                                onClick={() => this.props.onChange(option)}
                            >
                                {option.label}
                            </span>
                        ))}
                    </div>}

                    <div className={`${styles.icon_arrow}
                        ${this.state.dropdown && styles.arrow_active}`}>
                    </div>

                    {!this.props.outline && <div className={styles.border}></div>}
                </div>

            </div>
        );
    }
}

export default Select;
