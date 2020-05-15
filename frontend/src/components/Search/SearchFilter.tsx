import React from 'react';
import styles from './styles/SearchFilter.m.css';

class SearchFilter extends React.Component {
    render() {
        return (
            <div className={styles.SearchFilter}>
                <div className={styles.header}>
                    Фильтр
                </div>
            </div>
        );
    }
}

export default SearchFilter;
