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

interface Props {
    userId: number
}

interface State {
    DatePicker: boolean,
    familyStatus: OptionType,
    basicData: {
        firstName: string,
        lastName: string,
        birthday: string,
        country: string,
        city: string
    }
}

interface OptionType {
    label: string,
    value: string
}
  

class BasicData extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            DatePicker: false,
            familyStatus: { label: "", value: "" },
            basicData: {
                firstName: "",
                lastName: "",
                birthday: "",
                country: "",
                city: ""
            }
        };
    }

    async componentDidMount() {
        await this.updateData();
    }

    updateData = async () => {
        const resUserData = await fetch(`/api/users/get_user_data/${this.props.userId}`);
        const userData = await resUserData.json();
        const name = userData.name.split(" ");

        this.setState({
            familyStatus: { label: "", value: "" },
            basicData: {
                firstName: name[0],
                lastName: name[1],
                birthday: userData.birthday,
                country: userData.country,
                city: userData.city
            }
        });
    }

    setDatePicker = (value: boolean) => {
        this.setState({ DatePicker: value });
    }

    editBasicData = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            basicData: {
                ...this.state.basicData,
                [e.target.name]: e.target.value
            }
        })
    }

    editDate = (date: string) => {
        this.setState({ 
            basicData: { 
                ...this.state.basicData, 
                birthday: date 
            }
        });
    }

    render() {
        return (
            <div className={styles.Settings}>
                <header>Основные данные</header>
                
                    <InputField 
                        label="Имя:"
                        name="firstName"
                        value={this.state.basicData.firstName}
                        onChange={this.editBasicData}
                    />

                    <InputField 
                        label="Фамилия:"
                        name="lastName"
                        value={this.state.basicData.lastName}
                        onChange={this.editBasicData}
                    />

                    <InputField 
                        label="Дата рождения:"
                        name="birthday"
                        value={this.state.basicData.birthday}
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
                        name="country"
                        value={this.state.basicData.country}
                        onChange={this.editBasicData}
                    />

                    <InputField 
                        label="Город:"
                        name="city"
                        value={this.state.basicData.city}
                        onChange={this.editBasicData}
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
                            value={this.state.basicData.birthday}
                            onChange={this.editDate}
                            onClose={() => this.setDatePicker(false)}
                        />
                    </Backdrop>
            </div>
        );
    }
}

export default BasicData;
