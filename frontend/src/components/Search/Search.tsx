import React from 'react';
import styles from './styles/Search.m.css';

import Input from '../../containers/Search/Input';
import Container from '../../containers/Search/Container';

const Search = () => {
    return (
        <div className={styles.Search}>
            <Input />
            <Container />
        </div>
    );
}

export default Search;
