import React from 'react';
import TextAreaAutoSize from 'react-textarea-autosize';
import styles from './Styles.m.css';

interface Props {
    width?: number,
    label?: string,
    style?: object,
    minRows?: number,
    maxRows?: number,
    autoFocus?: boolean,
    maxLength?: number,
    readOnly?: boolean,
    disabled?: boolean,
    name?: string
    value?: string,
    onClick?: (event?: React.ChangeEvent<HTMLInputElement>) => void,
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onFocus?: () => void,
    onBlur?: () => void
}

const TextArea = (props: Props) => {
    return (
        <div className={styles.TextArea} 
            style={{
                width: props.width || 340,
                ...props.style
            }}
        >
            <TextAreaAutoSize className={styles.text_field} 
                minRows={props.minRows}
                maxRows={props.maxRows}
                autoComplete="off"
                autoFocus={props.autoFocus}
                maxLength={props.maxLength}
                readOnly={props.readOnly}
                disabled={props.disabled}
                name={props.name}
                value={props.value}
                onChange={props.onChange} 
                onFocus={props.onFocus}
                onBlur={props.onBlur}
            />

            {props.label && <span 
                className={styles.label}>
                {props.label}
            </span>}
        </div>
        
    );
}

export default TextArea;
