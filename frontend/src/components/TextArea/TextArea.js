import React from 'react';
import TextAreaAutoSize from 'react-textarea-autosize';
import styles from './TextArea.m.css';

const TextArea = props => {
    return (
        <div className={styles.TextArea} 
            style={props.style}
        >
            <TextAreaAutoSize className={styles.text_field} {...props} />

            {props.label && <span 
                className={styles.label}>
                {props.label}
            </span>}
        </div>
        
    );
}

export default TextArea;
