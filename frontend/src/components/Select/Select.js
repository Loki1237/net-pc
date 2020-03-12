import React from 'react';
import styles from './Select.css';

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown: false,
            showDropdown: false,
            selected: "",
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

    selectOption = (option) => {
        this.setState({ selected: option.label });
        this.props.onChange(option.value);
    }

    render() {
        return (
            <div className={styles.Select}
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
                        value={this.state.selected}
                        onClick={this.showDropdown}
                        onFocus={() => this.setFocus(true)}
                        onBlur={() => this.setFocus(false)}
                    />   

                    {this.state.dropdown && <div id="opt-cnr-87235"
                        className={`${styles.option_container}
                            ${this.state.showDropdown ? styles.opened : ""}`}
                    >
                        {this.props.options.map((option, index) => (
                            <span key={`option-${index}`}
                                className={`${styles.option}
                                    ${this.state.selected === option.label && this.state.focus
                                        ? styles.selected 
                                        : ""
                                    }
                                `}
                                onClick={() => this.selectOption(option)}
                            >
                                {option.label}
                            </span>
                        ))}
                    </div>}

                    {!this.props.outline && <div className={styles.border}></div>}
                </div>

            </div>
        );
    }
}

export default Select;
