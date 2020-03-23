import React from 'react';
import styles from './Settings.m.css';

import Button from '../../components/Button/Button';
import DropdownContainer from '../../components/Dropdown/DropdownContainer';
import DropdownMenu from '../../components/Dropdown/DropdownMenu';
import DropdownItem from '../../components/Dropdown/DropdownItem';
import Select from '../../components/Select/Select';

import { toast as notify } from 'react-toastify';

interface PropsType {
    
}

interface StateType {
    
}
  

class Settings extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
            <div className={styles.Settings}>
                
            </div>
        );
    }
}

export default Settings;
