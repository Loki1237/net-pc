import React from 'react';
import styles from './Styles.m.css';

import {
    Divider,
    DatePicker,
    InputField,
    Select,
    Backdrop,
    Button,
    IconButton,
    Row,
    Checkbox,
    Label
} from '../../shared';

import iconCalendar from '../../shared/icons/icon_calendar.png';

import { toast as notify } from 'react-toastify';
import { getMyId } from '../../middleware';

interface PropsType {
    
}

interface StateType {
    firstName: string,
    lastName: string,
    DatePicker: boolean,
    birthday: string,
    familyStatus: OptionType,
    country: string,
    city: string
}

interface OptionType {
    label: string,
    value: string
}
  

class BasicData extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            DatePicker: false,
            birthday: "",
            familyStatus: { label: "", value: "" },
            country: "",
            city: ""
        };
    }

    async componentDidMount() {
        const myId = await getMyId();
        const resUserData = await fetch(`/api/users/get_user_data/${myId}`);
        const userData = await resUserData.json();
        const name = userData.name.split(" ");

        this.setState({
            firstName: name[0],
            lastName: name[1],
            birthday: userData.birthday,
            country: userData.country,
            city: userData.city
        });
    }

    setDatePicker = (value: boolean) => {
        this.setState({ DatePicker: value });
    }

    render() {
        return (
            <div className={styles.Settings}>
                <header>Основные данные</header>
                
                    <InputField 
                        label="Имя:"
                        value={this.state.firstName}
                        onChange={(e: any) => {
                            this.setState({ firstName: e.target.value });
                        }}
                    />

                    <InputField 
                        label="Фамилия:"
                        value={this.state.lastName}
                        onChange={(e: any) => {
                            this.setState({ lastName: e.target.value });
                        }}
                    />

                    <InputField 
                        label="Дата рождения:"
                        value={this.state.birthday}
                        readOnly
                        icon={
                            <IconButton size="medium"
                                onClick={() => this.setDatePicker(true)}
                            >
                                <img src={iconCalendar} width={16} height={16} />
                            </IconButton>
                        }
                    />

                    <Select
                        label="Семейное положение:"
                        selected={this.state.familyStatus}
                        onChange={(value: OptionType) => {
                            this.setState({ familyStatus: value });
                        }}
                        options={[
                            { label: "Женат", value: "married"},
                            { label: "Не женат", value: "nomarried"},
                        ]}
                    />

                    <InputField 
                        label="Страна:"
                        value={this.state.country}
                        onChange={(e: any) => {
                            this.setState({ country: e.target.value });
                        }}
                    />

                    <InputField 
                        label="Город:"
                        value={this.state.city}
                        onChange={(e: any) => {
                            this.setState({ city: e.target.value });
                        }}
                    />

                    <Divider spaceY={12} />

                    <Button color="primary">Сохранить</Button>

                    <Backdrop 
                        blackout
                        isOpened={this.state.DatePicker}
                        onClose={() => this.setDatePicker(false)}
                    >
                        <DatePicker
                            minYear={1900}
                            maxYear={2100}
                            value={this.state.birthday}
                            onChange={(date: string) => {
                                this.setState({ birthday: date });
                            }}
                            onClose={() => this.setDatePicker(false)}
                        />
                    </Backdrop>
            </div>
        );
    }
}

export default BasicData;
