import React from 'react';
import styles from './Bookmarks.css';

interface Props {
    
}

class Bookmarks extends React.Component <Props, {}> {
    render() {
        return (
            <div className={styles.Bookmarks}>
                <h1>Bookmarks</h1>
            </div>
        );
    }
}

export default Bookmarks;
