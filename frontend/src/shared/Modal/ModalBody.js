import React from 'react';
import styles from './Styles.m.css';

const ModalBody = (props) => {
    return (
        <div className={styles.ModalBody}
            style={props.style}
            align={props.align}
        >
            
            {props.children}

        </div>
    );
}

export default ModalBody;
