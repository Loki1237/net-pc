import React from 'react';
import styles from './Styles.m.css';

import { history } from '../../middleware';
import { toast as notify } from 'react-toastify';

import {
    Backdrop,
    Button,
    DatePicker,
    Divider,
    IconButton,
    InputField,
    Select,
    Stepper,
    StepperItem,
    StepDivider
} from '../../shared';

import iconCalendar from '../../shared/icons/icon_calendar.png';

interface Props {
     
}

interface GenderOption {
    label: string,
    value: string
}

interface State {
    step: number,
    gender: GenderOption,
    DatePicker: boolean,
    birthday: string,
    textFields: {
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        country: string,
        city: string
    }
}

class SignUp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            step: 1,
            gender: { label: "", value: "" },
            DatePicker: false,
            birthday: "",
            textFields: {
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                country: "",
                city: ""
            }
        };
    }

    setDatePicker = (value: boolean) => {
        this.setState({ DatePicker: value });
    }

    setStep = (step: number) => {
        this.setState({ step });
    }

    editTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            textFields: {
                ...this.state.textFields,
                [e.target.name]: e.target.value
            }
        });
    }

    goToCheckingData = () => {
        const { gender, birthday } = this.state;
        const { firstName, lastName, country, city } = this.state.textFields;

        if (!firstName || !lastName || !gender.value || !birthday || !country || !city) {
            notify.warn("Заполните все поля");
            return;
        }

        this.setStep(2);
    }

    signUp = async () => {
        const { email, password } = this.state.textFields;

        if (!email || !password) {
            notify.warn("Введите ваш email и логин");
            return;
        }

        const res = await fetch('/api/auth/sign-up', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                gender: this.state.gender.value,
                birthday: this.state.birthday,
                ...this.state.textFields
            })
        });

        if (res.status === 200) {
            this.setStep(4);
        } else {
            const result = await res.json();
            notify.error(result.error);
        }
    }

    goToMyPage = async () => {
        const res = await fetch('/api/auth/login', { 
            method: "POST",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                email: this.state.textFields.email,
                password: this.state.textFields.password
            })
        });
        
        if (res.status === 200) {
            history.push('/my-page');
        } else {
            notify.error("Error");
        }
    }

    render() {
        const step = this.state.step;

        return (
            <div className={styles.container}>
                <Divider spaceY={10} bg="transparent" />

                <div className={styles.row}>
                    <Stepper>
                        <StepperItem active={step === 1}
                            completed={step === 2 || step === 3 || step === 4}
                        />
                        <StepDivider />
                        <StepperItem active={step === 2}
                            completed={step === 3 || step === 4}
                        />
                        <StepDivider />
                        <StepperItem active={step === 3}
                            completed={step === 4}
                        />
                    </Stepper>
                </div>

                <div className={styles.row}>
                    <Divider spaceY={10} bg="transparent" />
                </div>

                {/* ========== Заполнение данных ==========*/}
                {step === 1 &&  <div className={styles.container}>
                    <InputField 
                        label="Имя:"
                        name="firstName"
                        value={this.state.textFields.firstName}
                        onChange={this.editTextField}
                    />

                    <InputField 
                        label="Фамилия:"
                        name="lastName"
                        value={this.state.textFields.lastName}
                        onChange={this.editTextField}
                    />

                    <div className={styles.row}>
                        <Select width={110}
                            outline
                            label="Пол:"
                            labelPlacement="top"
                            selected={this.state.gender}
                            onChange={(value: GenderOption) => {
                                this.setState({ gender: value });
                            }}
                            options={[
                                { label: "Мужской", value: "male"},
                                { label: "Женский", value: "female"},
                            ]}
                        />

                        <InputField width={180}
                            outline
                            label="Дата рождения:"
                            labelPlacement="top"
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
                        
                    </div>

                    <div className={styles.row}>
                        <Divider spaceY={12} bg="transparent" />
                    </div>

                    <InputField 
                        label="Страна:"
                        name="country"
                        value={this.state.textFields.country}
                        onChange={this.editTextField}
                    />

                    <InputField 
                        label="Город:"
                        name="city"
                        value={this.state.textFields.city}
                        onChange={this.editTextField}
                    />

                    <div className={styles.checking_row}>
                        <Divider spaceY={10} bg="transparent" />
                    </div>

                    <Button color="info"
                        onClick={this.goToCheckingData}
                    >
                        Продолжить
                    </Button>
                </div>}

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

                {/* ========== Проверка введённых данных ==========*/}
                {step === 2 && <div className={styles.container}>
                    <div className={styles.checking_row}>
                        <span>Имя</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.textFields.firstName}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Фамилия</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.textFields.lastName}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Пол</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.gender.label}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Дата рождения</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.birthday}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Страна</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.textFields.country}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Город</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.textFields.city}</span>
                    </div>

                    <Divider spaceY={10} bg="transparent" />

                    <div className={styles.row}>
                        <Button color="secondary"
                            onClick={() => this.setStep(1)}
                        >
                            Назад
                        </Button>

                        <Button color="info"
                            onClick={() => this.setStep(3)}
                        >
                            Далее
                        </Button>
                    </div>
                </div>}

                {/* ========== Окончание регистрации ==========*/}
                {step === 3 && <div className={styles.container}>
                    <InputField 
                        label="Эл. почта:"
                        name="email"
                        value={this.state.textFields.email}
                        onChange={this.editTextField}
                    />

                    <InputField type="password"
                        label="Пароль:"
                        name="password"
                        value={this.state.textFields.password}
                        onChange={this.editTextField}
                    />

                    <div className={styles.checking_row}>
                        <Divider spaceY={10} bg="transparent" />
                    </div>

                    <div className={styles.row}>
                        <Button color="secondary"
                            onClick={() => this.setStep(2)}
                        >
                            Назад
                        </Button>

                        <Button color="info"
                            onClick={this.signUp}
                        >
                            Зарегестрироваться
                        </Button>
                    </div>
                </div>}

                {/* ========== Сообщение об успешной регистрации ==========*/}
                {step === 4 && <div className={styles.container}>
                    <div className={styles.row}>
                        <span>
                            {this.state.textFields.firstName + " " + this.state.textFields.lastName} 
                            успешно зарегестрирован.
                        </span>
                    </div>

                    <Divider spaceY={10} bg="transparent" />

                    <Button color="info" onClick={this.goToMyPage}>
                        Перейти на мою страницу
                    </Button>
                </div>}
            </div>
        );
    }
}

export default SignUp;
