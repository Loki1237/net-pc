import React from 'react';
import styles from './styles/SearchFilter.m.css';

import UserPrew from './UserPrew';
import { Divider, Icon } from '../../shared';

interface Props {
    
}

interface State {
    
}

class SearchFilter extends React.Component<Props, State> {
    state = {
            
    };

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
