import React from 'react';
import styles from './styles/InputMessageField.m.css';

import { Icon } from '../../shared';
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    send: () => void
}

const InputMessageField = (props: Props) => {
    return(
        <div className={styles.input_message_field}>
            <TextareaAutosize maxRows={5}
                autoFocus
                placeholder="Сообщение"
                className={styles.text_field}
                value={props.value}
                onChange={props.onChange}
            />
            
            <button className={styles.send_message_button} 
                disabled={!props.value}
                onClick={props.send}
            >
                <Icon img="send_message" size="large" />
            </button>
        </div>
    );
}

export default InputMessageField;
