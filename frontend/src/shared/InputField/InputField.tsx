import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    type?: string,
    label?: string,
    labelPlacement?: string,
    width?: number,
    style?: object,
    autoFocus?: boolean,
    maxLength?: number,
    readOnly?: boolean,
    disabled?: boolean,
    outline?: boolean,
    name?: string
    value?: string,
    icon?: React.ReactElement,
    onClick?: (event?: React.ChangeEvent<HTMLInputElement>) => void,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onFocus?: () => void,
    onBlur?: () => void
}

const InputField = (props: Props) => {
    let [type, setType] = React.useState(props.type || "text");
    let [focus, setFocus] = React.useState(false);

    const onFocus = () => {
        setFocus(true);

        if (props.onFocus) {
            props.onFocus();
        }
    }

    const onBlur = () => {
        setFocus(false);

        if (props.onBlur) {
            props.onBlur();
        }
    }

    const inputFieldClassNames = classNames({
        [styles.InputField]: true,
        [styles.column_dir]: props.labelPlacement === "top"
    });

    const labelClassNames = classNames({
        [styles.label]: true,
        [styles.label_focus]: focus
    });

    const inputElementClassNames = classNames({
        [styles.input]: true,
        [styles.outline]: props.outline
    });

    return (
        <div className={inputFieldClassNames}
            style={{
                width: props.width || 340,
                ...props.style
            }}
        >
            {props.label && <span className={labelClassNames}>
                {props.label}
            </span>}
            
            <div className={styles.input_container}>
                <input type={type} 
                    autoComplete="off"
                    autoFocus={props.autoFocus}
                    maxLength={props.maxLength}
                    readOnly={props.readOnly}
                    disabled={props.disabled}
                    className={inputElementClassNames}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange} 
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                {!props.outline && !props.readOnly && <div className={styles.border}></div>}
                
                <div className={styles.icon_container}>
                    {props.type === "password" && <div className={styles.eye}
                        onClick={() => setType(type === "text" ? "password" : "text")}>
                        {type === "password" && <div className={styles["eye-slash"]}></div>}
                    </div>}

                    {props.type !== "password" && props.icon}
                </div>
            </div>
        </div>
    );
}

export default InputField;
