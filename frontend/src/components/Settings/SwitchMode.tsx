import React from 'react';
import styles from './Styles.m.css';

import {
    Tabs,
    Tab
} from '../../shared';

import { history } from '../../middleware';
import { Link } from 'react-router-dom';

interface Props {
    
}

interface State {
    mode: string
}
  

class SwitchMode extends React.Component<Props, State> {
    constructor(props: Props) {
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
                
                <Tabs column size="small">
                    <Tab 
                        active={this.state.mode === 'basic'}
                        onClick={() => this.setMode('basic')}
                    >
                        Основное
                    </Tab>

                    <Tab 
                        active={this.state.mode === 'about_self'}
                        onClick={() => this.setMode('about_self')}
                    >
                        О себе
                    </Tab>

                    <Tab 
                        active={this.state.mode === 'settings'}
                        onClick={() => this.setMode('settings')}
                    >
                        Настройки
                    </Tab>
                </Tabs>

            </div>
        );
    }
}

export default SwitchMode;
