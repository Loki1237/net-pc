import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    label?: any,
    labelPlacement?: string,
    value: Option,
    width?: number,
    disabled?: boolean,
    outline?: boolean,
    options: Option[],
    onChange: (option: Option) => void
}

interface Option {
    label: string, 
    value: string
}

const Select = (props: Props) => {
    let [dropdown, setDropdonw] = React.useState(false);
    let [focus, setFocus] = React.useState(false);

    const showDropdown = () => {
        if (!dropdown) {
            setDropdonw(true);

            document.addEventListener("click", () => setDropdonw(false), { once: true });
        }
    }

    const selectClassNames = classNames({
        [styles.Select]: true,
        [styles.column_dir]: props.labelPlacement === "top",
    });

    const labelClassNames = classNames({
        [styles.label]: true,
        [styles.label_focus]: focus
    });

    const inputElementClassNames = classNames({
        [styles.value]: true,
        [styles.outline]: props.outline
    });

    const optionContainerClassNames = classNames({
        [styles.option_container]: true,
        [styles.closed]: !dropdown
    });

    const iconArrowClassNames = classNames({
        [styles.icon_arrow]: true,
        [styles.arrow_active]: dropdown
    });

    return (
        <div
            className={selectClassNames}
            style={{ width: props.width }}
        >   
            {props.label && <span className={labelClassNames}>
                {props.label}
            </span>}

            <div className={styles.control}>
                <input readOnly
                    className={inputElementClassNames}
                    disabled={props.disabled}
                    value={props.value.label}
                    onClick={showDropdown}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />   

                <div className={optionContainerClassNames}>
                    {props.options.map((option, index) => (
                        <span key={`option-${index}`}
                            className={classNames({
                                [styles.option]: true,
                                [styles.selected]: props.value.value === option.value && focus
                            })}
                            onClick={() => props.onChange(option)}
                        >
                            {option.label}
                        </span>
                    ))}
                </div>

                <div className={iconArrowClassNames}>
                </div>

                {!props.outline && <div className={styles.border}></div>}
            </div>

        </div>
    );
}

export default Select;
