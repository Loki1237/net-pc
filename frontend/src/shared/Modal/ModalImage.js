import React from 'react';
import styles from './Styles.m.css';

const ModalImage = (props) => {
    return (
        <div className={styles.ModalImage}>
            <div className={styles.image_container}>
                <img className={styles.image} src={props.image} />
                
                {props.backButton && <div className={`${styles.navigation} ${styles.back}`}>
                    {props.backButton}
                </div>}

                {props.nextButton && <div className={`${styles.navigation} ${styles.next}`}>
                    {props.nextButton}
                </div>}
            </div>

            <div className={styles.ModalImage_actions}>
                {props.closeButton && <div className={styles.closeButton}>
                    {props.closeButton}
                </div>}
                
                {props.children}
            </div>
        </div>
    );
}

export default ModalImage;
