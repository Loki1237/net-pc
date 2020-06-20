import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    label?: any,
    labelPlacement?: string,
    value: string,
    width?: number,
    disabled?: boolean,
    outline?: boolean,
    children: React.ReactElement[],
    onChange: (value: string) => void
}

type Field = { [field: string]: string };

class Select extends React.Component<Props> {
    options: Field = {};
    state = {
        dropdown: false,
        focus: false,
        label: ""
    }

    componentDidMount() {
        this.props.children.map(option => {
            this.options[option.props.value] = option.props.children;
        });
        this.setState({ label: this.options[this.props.children[0].props.value] });
        this.props.onChange(this.options[this.props.children[0].props.value]);
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.value !== prevProps.value) {
            this.setState({ label: this.options[this.props.value] });
        }
    }

    showDropdown = () => {
        if (!this.state.dropdown) {
            this.setState({ dropdown: true });

            document.addEventListener("click", () => this.setState({ dropdown: false }), { once: true });
        }
    }

    render() {
        const selectClassNames = classNames({
            [styles.Select]: true,
            [styles.column_dir]: this.props.labelPlacement === "top",
        });
    
        const labelClassNames = classNames({
            [styles.label]: true,
            [styles.label_focus]: this.state.focus
        });
    
        const inputElementClassNames = classNames({
            [styles.value]: true,
            [styles.outline]: this.props.outline
        });
    
        const optionContainerClassNames = classNames({
            [styles.option_container]: true,
            [styles.closed]: !this.state.dropdown
        });
    
        const iconArrowClassNames = classNames({
            [styles.icon_arrow]: true,
            [styles.arrow_active]: this.state.dropdown
        });

        return (
            <div className={selectClassNames}
                style={{ width: this.props.width }}
            >
                {this.props.label && <span className={labelClassNames}>
                    {this.props.label}
                </span>}

                <div className={styles.control}>
                    <input readOnly
                        className={inputElementClassNames}
                        disabled={this.props.disabled}
                        value={this.state.label}
                        onClick={this.showDropdown}
                        onFocus={() => this.setState({ focus: true })}
                        onBlur={() => this.setState({ focus: false })}
                    />

                    <div className={optionContainerClassNames}>
                        {this.props.children.map(option => {
                            return React.cloneElement(option, {
                                key: option.props.value,
                                selected: this.props.value === option.props.value,
                                onClick: () => this.props.onChange(option.props.value)
                            });
                        })}
                    </div>

                    <div className={iconArrowClassNames}></div>

                    {!this.props.outline && <div className={styles.border}></div>}
                </div>
            </div>
        );
    }
}

export default Select;
