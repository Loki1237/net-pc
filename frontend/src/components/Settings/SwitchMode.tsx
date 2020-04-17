import React from 'react';
import styles from './Styles.m.css';
import Switch from '../../shared/Switch/Switch';
import SwitchItem from '../../shared/Switch/SwitchItem';

import { history } from '../../middleware';
import { Link } from 'react-router-dom';

interface PropsType {
    
}

interface StateType {
    mode: string
}
  

class SwitchMode extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            mode: "basic"
        }
    }

    componentDidMount() {
        this.setMode('basic');
    }

    setMode = (mode: string) => {
        history.push('/edit/' + mode);
        this.setState({ mode });
    }

    render() {
        return (
            <div className={styles.SwitchMode}>
                
                <Switch column size="small">
                    <SwitchItem 
                        active={this.state.mode === 'basic'}
                        onClick={() => this.setMode('basic')}
                    >
                        Основное
                    </SwitchItem>

                    <SwitchItem 
                        active={this.state.mode === 'about_self'}
                        onClick={() => this.setMode('about_self')}
                    >
                        О себе
                    </SwitchItem>

                    <SwitchItem 
                        active={this.state.mode === 'settings'}
                        onClick={() => this.setMode('settings')}
                    >
                        Настройки
                    </SwitchItem>
                </Switch>

            </div>
        );
    }
}

export default SwitchMode;
