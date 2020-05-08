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
import _ from 'lodash';

interface Props {
    userId: number
}

interface State {
    DatePicker: boolean,
    gender: string,
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

const maleFamilyStatusOptions = [
    { label: "Женат", value: "married" },
    { label: "Свободен", value: "free" },
    { label: "Есть девушка", value: "has_partner" },
    { label: "Познакомлюсь", value: "want_meet" },
    { label: "Не выбрано", value: "not_selected" }
];

const femaleFamilyStatusOptions = [
    { label: "Замужем", value: "married" },
    { label: "Свободна", value: "free" },
    { label: "Есть парень", value: "has_partner" },
    { label: "Познакомлюсь", value: "want_meet" },
    { label: "Не выбрано", value: "not_selected" }
];

class BasicData extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            DatePicker: false,
            gender: "",
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
        const familyStatusOptions = userData.gender === "male" ? maleFamilyStatusOptions :
                                    userData.gender === "female" ? femaleFamilyStatusOptions : [];
        const index = _.findIndex(familyStatusOptions, { value: userData.family_status });

        this.setState({
            gender: userData.gender,
            familyStatus: familyStatusOptions[index],
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

    changeFamilyStatus = (option: OptionType) => {
        this.setState({ familyStatus: option });
    }

    saveChangedBasicInfo = async () => {
        const res = await fetch(`/api/users/change_basic_info/${this.props.userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                ...this.state.basicData,
                familyStatus: this.state.familyStatus.value
            })
        });
 
        if (res.status === 200) {
            notify.success("Данные сохранены");
        } else {
            const resParse = await res.json();
            notify.error(resParse.error);
        }
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
                        value={this.state.familyStatus}
                        onChange={this.changeFamilyStatus}
                        options={this.state.gender === "male" ? maleFamilyStatusOptions :
                            this.state.gender === "female" ? femaleFamilyStatusOptions : []
                        }
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

                    <Button color="primary"
                        onClick={this.saveChangedBasicInfo}
                    >
                        Сохранить
                    </Button>

                    <Backdrop 
                        blackout
                        isOpened={this.state.DatePicker}
                        onClose={() => this.setDatePicker(false)}
                    >
                        <DatePicker
                            isOpened={this.state.DatePicker}
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
