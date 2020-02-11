import React from 'react';
import styles from './TextArea.css';

const TextArea = props => {
    return (
        <div className={styles.TextArea}>
            <textarea className={styles.area}
                style={props.style}
                rows={props.rows}
                value={props.value}
                onChange={props.onChange} >
            </textarea>

            {props.name && <span className={styles.fieldName}>
                {props.name}
            </span>}

            <div className={styles.border}></div>
        </div>
        
    );
}

export default TextArea;
