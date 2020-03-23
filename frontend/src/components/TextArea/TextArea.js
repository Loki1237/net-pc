import React from 'react';
import styles from './TextArea.m.css';

const TextArea = props => {
    return (
        <div className={styles.TextArea} 
            style={props.style}
        >
            <textarea className={styles.text_field}
                rows={props.rows}
                value={props.value}
                onChange={props.onChange} >
            </textarea>

            {props.label && <span className={styles.label}>
                {props.label}
            </span>}
        </div>
        
    );
}

export default TextArea;
