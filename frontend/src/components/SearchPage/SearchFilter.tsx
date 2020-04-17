import React from 'react';
import styles from './styles/SearchFilter.m.css';

import IconButton from '../../shared/IconButton/IconButton';
import UserPrew from './UserPrew';

import defaultAvatar from '../../images/default_avatar.png';
import iconSearchGray from '../../shared/icons/icon_search_gray.png';

interface Props {
    
}

interface State {
    
}

class SearchFilter extends React.Component <Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            
        };
    }

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
