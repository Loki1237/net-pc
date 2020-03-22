import React from 'react';
import styles from './TextArea.css';

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

            {props.name && <span className={styles.field_name}>
                {props.name}
            </span>}

            <div className={styles.border}></div>
        </div>
        
    );
}

export default TextArea;