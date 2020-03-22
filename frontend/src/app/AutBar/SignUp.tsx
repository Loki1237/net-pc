import React from 'react';
import styles from './Styles.m.css';

import { history } from '../middleware';
import { toast as notify } from 'react-toastify';

import DatePicker from '../../components/DatePicker/DatePicker';
import Backdrop from '../../components/Backdrop/Backdrop';
import Select from '../../components/Select/Select';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import Divider from '../../components/Divider/Divider';
import Stepper from '../../components/Stepper/Stepper';
import StepperItem from '../../components/Stepper/StepperItem';
import StepDivider from '../../components/Stepper/StepDivider';

import iconCalendar from '../../components/icons/icon_calendar.png';

interface PropsType {
     
}

interface OptionType {
    label: string,
    value: string
}

interface StateType {
    step: number,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: OptionType,
    DatePicker: boolean,
    birthday: string,
    country: string,
    city: string
}

class SignUp extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            step: 1,
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            gender: { label: "", value: "" },
            DatePicker: false,
            birthday: "",
            country: "",
            city: ""
        };
    }

    setDatePicker = (value: boolean) => {
        this.setState({ DatePicker: value });
    }

    setStep = (step: number) => {
        this.setState({ step });
    }

    goToCheckingData = () => {
        const { firstName, lastName, gender, birthday, country, city } = this.state;

        if (!firstName || !lastName || !gender.value || !birthday || !country || !city) {
            notify.warn("Заполните все поля");
            return;
        }

        this.setStep(2);
    }

    signUp = async () => {
        const { email, password } = this.state;

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
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                gender: this.state.gender.value,
                birthday: this.state.birthday,
                country: this.state.country,
                city: this.state.city
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
                email: this.state.email,
                password: this.state.password
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
                        label="Имя"
                        value={this.state.firstName}
                        onChange={(e: any) => {
                            this.setState({ firstName: e.target.value });
                        }}
                    />

                    <InputField 
                        label="Фамилия"
                        value={this.state.lastName}
                        onChange={(e: any) => {
                            this.setState({ lastName: e.target.value });
                        }}
                    />

                    <div className={styles.row}>
                        <Select width={110}
                            outline
                            label="Пол"
                            labelPlacement="top"
                            selected={this.state.gender}
                            onChange={(value: OptionType) => {
                                this.setState({ gender: value });
                            }}
                            options={[
                                { label: "Мужской", value: "male"},
                                { label: "Женский", value: "female"},
                            ]}
                        />

                        <InputField width={180}
                            outline
                            label="Дата рождения"
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
                        label="Страна"
                        value={this.state.country}
                        onChange={(e: any) => {
                            this.setState({ country: e.target.value });
                        }}
                    />

                    <InputField 
                        label="Город"
                        value={this.state.city}
                        onChange={(e: any) => {
                            this.setState({ city: e.target.value });
                        }}
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
                        maxYear={2006}
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
                        <span>{this.state.firstName}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Фамилия</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.lastName}</span>
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
                        <span>{this.state.country}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Город</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.city}</span>
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
                        label="Эл. почта"
                        value={this.state.email}
                        onChange={(e: any) => {
                            this.setState({ email: e.target.value });
                        }}
                    />

                    <InputField type="password"
                        label="Пароль"
                        value={this.state.password}
                        onChange={(e: any) => {
                            this.setState({ password: e.target.value });
                        }}
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
                            {this.state.firstName + " " + this.state.lastName} успешно зарегестрирован.
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
