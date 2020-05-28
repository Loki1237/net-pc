import React from 'react';
import styles from './Styles.m.css';

import { SignUpUserData } from '../../store/AutBar/types';
import { toast as notify } from 'react-toastify';

import {
    Backdrop,
    Button,
    DatePicker,
    Divider,
    IconButton,
    Icon,
    InputField,
    Option,
    Select,
    Stepper,
    StepItem,
    StepDivider
} from '../../shared';

interface Props {
    signUpLoading: boolean,
    error: string,
    signUp: (data: SignUpUserData) => void
}

interface State {
    step: number,
    DatePicker: boolean,
    data: SignUpUserData
}

class SignUp extends React.Component<Props, State> {
    state: State = {
        step: 1,
        DatePicker: false,
        data: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            country: "",
            city: "",
            gender: "",
            birthday: ""
        }
    };

    setDatePicker = (value: boolean) => {
        this.setState({ DatePicker: value });
    }

    setStep = (step: number) => {
        this.setState({ step });
    }

    editTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            }
        });
    }

    selectGender = (gender: string) => {
        this.setState({
            data: {
                ...this.state.data,
                gender
            }
        });
    }

    selectBirthDay = (birthday: string) => {
        this.setState({
            data: {
                ...this.state.data,
                birthday
            }
        });
    }

    goToCheckingData = () => {
        const { firstName, lastName, country, city, gender, birthday } = this.state.data;

        if (!firstName || !lastName || !gender || !birthday || !country || !city) {
            notify.warn("Заполните все поля");
            return;
        }

        this.setStep(2);
    }

    signUp = async () => {
        const { email, password } = this.state.data;

        if (!email || !password) {
            notify.warn("Введите ваш email и логин");
            return;
        }

        this.props.signUp(this.state.data);
    }

    render() {
        const step = this.state.step;

        return (
            <div className={styles.container}>
                <Divider spaceY={10} bg="transparent" />

                <div className={styles.row}>
                    <Stepper>
                        <StepItem active={step === 1}
                            completed={step === 2 || step === 3 || step === 4}
                        />
                        <StepDivider />
                        <StepItem active={step === 2}
                            completed={step === 3 || step === 4}
                        />
                        <StepDivider />
                        <StepItem active={step === 3}
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
                        value={this.state.data.firstName}
                        onChange={this.editTextField}
                    />

                    <InputField 
                        label="Фамилия:"
                        name="lastName"
                        value={this.state.data.lastName}
                        onChange={this.editTextField}
                    />

                    <div className={styles.row}>
                        <Select width={110}
                            outline
                            label="Пол:"
                            labelPlacement="top"
                            value={this.state.data.gender}
                            onChange={this.selectGender}
                        >
                            <Option value="male">Мужской</Option>
                            <Option value="female">Женский</Option>
                        </Select>

                        <InputField width={180}
                            outline
                            label="Дата рождения:"
                            labelPlacement="top"
                            value={this.state.data.birthday}
                            readOnly
                            icon={
                                <IconButton onClick={() => this.setDatePicker(true)}>
                                    <Icon img="calendar" color="gray" />
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
                        value={this.state.data.country}
                        onChange={this.editTextField}
                    />

                    <InputField 
                        label="Город:"
                        name="city"
                        value={this.state.data.city}
                        onChange={this.editTextField}
                    />

                    <div className={styles.checking_row}>
                        <Divider spaceY={10} bg="transparent" />
                    </div>

                    <Button color="info" onClick={this.goToCheckingData}>
                        Продолжить
                    </Button>
                </div>}

                <Backdrop 
                    blackout
                    isOpened={this.state.DatePicker}
                    onClose={() => this.setDatePicker(false)}
                >
                    <DatePicker 
                        isOpened={this.state.DatePicker}
                        minYear={1900}
                        maxYear={2100}
                        value={this.state.data.birthday}
                        onChange={this.selectBirthDay}
                        onClose={() => this.setDatePicker(false)}
                    />
                </Backdrop>

                {/* ========== Проверка введённых данных ==========*/}
                {step === 2 && <div className={styles.container}>
                    <div className={styles.checking_row}>
                        <span>Имя</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.data.firstName}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Фамилия</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.data.lastName}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Пол</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.data.gender}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Дата рождения</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.data.birthday}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Страна</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.data.country}</span>
                    </div>

                    <div className={styles.checking_row}>
                        <span>Город</span>
                        <Divider spaceY={0} spaceX={12} />
                        <span>{this.state.data.city}</span>
                    </div>

                    <Divider spaceY={10} bg="transparent" />

                    <div className={styles.row}>
                        <Button color="secondary" onClick={() => this.setStep(1)}>
                            Назад
                        </Button>

                        <Button color="info" onClick={() => this.setStep(3)}>
                            Далее
                        </Button>
                    </div>
                </div>}

                {/* ========== Окончание регистрации ==========*/}
                {step === 3 && <div className={styles.container}>
                    <InputField 
                        label="Эл. почта:"
                        name="email"
                        value={this.state.data.email}
                        onChange={this.editTextField}
                    />

                    <InputField type="password"
                        label="Пароль:"
                        name="password"
                        value={this.state.data.password}
                        onChange={this.editTextField}
                    />

                    <div className={styles.checking_row}>
                        <Divider spaceY={10} bg="transparent" />
                    </div>

                    <div className={styles.row}>
                        <Button color="secondary" onClick={() => this.setStep(2)}>
                            Назад
                        </Button>

                        <Button color="info" onClick={this.signUp}>
                            Зарегестрироваться
                        </Button>
                    </div>
                </div>}
            </div>
        );
    }
}

export default SignUp;
