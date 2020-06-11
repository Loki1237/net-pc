import React from 'react';
import styles from './styles/DataField.m.css';

interface Props {
    name: string,
    value: string
};

interface Fields<T> {
    [field: string]: T;
}

const fieldNames: Fields<string> = {
    gender: "Пол",
    birthday: "День рождения",
    country: "Страна",
    city: "Город",
    familyStatus: "Семейное положение",
    activity: "Деятельность",
    interests: "Интересы",
    hobby: "Хобби",
    aboutSelf: "О себе"
};

const someFieldValues: Fields<string> = {
    // пол
    male: "Мужской",
    female: "Женский",
    // семейное положение
    married: "В браке",
    free: "Свободен/на",
    has_partner: "Встречаюсь",
    want_meet: "Познакомлюсь",
    not_selected: "Не выбрано"
};

const DataField = (props: Props) => {
    if (props.name in fieldNames === false) {
        return null;
    }

    const fieldName = fieldNames[props.name];
    const fieldValue = props.value in someFieldValues ? someFieldValues[props.value] : props.value;

    return (
        <div className={styles.DataField}>
            <span className={styles.field_name}>
                {fieldName}:
            </span>

            <span className={styles.field_value}>
                {fieldValue}
            </span>
        </div>
    );
}

export default DataField;
