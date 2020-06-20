import React from 'react';
import styles from './Styles.m.css';
import _ from 'lodash';
import classNames from 'classnames';

interface Props {
    isOpened: boolean,
    minYear?: number,
    maxYear?: number,
    value: string,
    onChange: (date: string) => void,
    onClose: () => void
}

interface State {
    year: number,
    month: number,
    day: number,
    dayName: string,
    weeks: string[][]
}

const monthNames = [
    "Январь", 
    "Февраль", 
    "Март", 
    "Апрель", 
    "Май", 
    "Июнь", 
    "Июль", 
    "Август", 
    "Сентябрь", 
    "Октябрь", 
    "Ноябрь", 
    "Декабрь"
];

const dayNames = [
    "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
];

class DatePicker extends React.Component<Props, State> {
    state = {
        year: 1970,
        month: 0,
        day: 1,
        dayName: dayNames[0],
        weeks: []
    };

    componentDidMount() {
        let year, month, day;

        if (this.props.value) {
            const [d, m, y] = this.props.value.split(".");
            year = +y;
            month = +m - 1;
            day = +d;
        } else {
            const date = new Date();
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }

        const dayName = new Date(year, month, day).getDay();
        this.setState({ year, month, day, dayName: dayNames[dayName] });
        this.updateTable(year, month);
    }

    setValue = () => {
        let { year, month, day } = this.state;
        month++;

        let newDay = day >= 10 ? `${day}` : `0${day}`;
        let newMonth = month >= 10 ? `${month}` : `0${month}`;

        this.props.onChange(`${newDay}.${newMonth}.${year}`);
        this.props.onClose();
    }

    setDay = (day: string) => {
        const { year, month } = this.state;
        const selectedDate = new Date(year, month, +day);

        if (day === " ") return;

        this.setState({ 
            day: +day,
            dayName: dayNames[selectedDate.getDay()]
        });
    }

    slideMonth = (direction: string) => {
        const { year, month } = this.state;
        let newMonth = month;

        switch (direction) {
            case "prev":
                newMonth = month === 0 ? 11 : month - 1;
                if (month === 0) {
                    this.slideYear("prev", 1);
                }
                break;

            case "next":
                newMonth = month === 11 ? 0 : month + 1;
                if (month === 11) {
                    this.slideYear("next", 1);
                }
                break;
        }

        this.setState({ month: newMonth, day: 1 });
        this.updateTable(year, newMonth);
    }

    slideYear = (direction: string, count: number) => {
        const currentYear = new Date().getFullYear();
        const min = this.props.minYear || currentYear + 100;
        const max = this.props.maxYear || currentYear + 100;
        const { year, month } = this.state;
        let newYear = year;

        switch (direction) {
            case "prev":
                newYear = year - count;
                break;

            case "next":
                newYear = year + count;
                break;
        }

        if (newYear >= max) newYear = max;
        if (newYear <= min) newYear = min;

        this.setState({ year: newYear, day: 1 });
        this.updateTable(newYear, month);
    }

    updateTable = (year: number, month: number) => {
        let date = new Date(year, month);
        let currentMonth = date.getMonth();
        let currentYear = date.getFullYear();
        let dayCount = 32 - new Date(currentYear, currentMonth, 32).getDate();
        let dayArray = [];

        for (let i = 1; i <= date.getDay(); i++) {
            dayArray.push(" ");
        }

        for (let i = 1; i <= dayCount; i++) {
            let date = new Date(currentYear, currentMonth, i);
            dayArray.push(`${date.getDate()}`);
        }

        let a = 42 - dayArray.length;
        for (let i = 0; i < a; i++) {
            dayArray.push(" ");
        }

        this.setState({ weeks: _.chunk(dayArray, 7) });
    }

    render() {
        const { year, month, day, dayName, weeks } = this.state;
        const datePickerClassnames = classNames({
            [styles.DatePicker]: true,
            [styles.opened]: this.props.isOpened
        });

        return (
            <div className={datePickerClassnames}>
                <div className={styles.header}>
                    <p>
                        {`${dayName}, ${day} ${monthNames[month].substr(0, 3)} ${year}`}
                    </p>

                    <div className={styles.selectors}>
                        <div className={styles.selector}>
                            <span>Месяц:</span>

                            <div className={styles.arrow_buttons}>
                                <button onClick={() => this.slideMonth("prev")}>
                                    {"<"}
                                </button>

                                <span>{monthNames[month]}</span>

                                <button onClick={() => this.slideMonth("next")}>
                                    {">"}
                                </button>
                            </div>
                        </div>

                        <div className={styles.selector}>
                            <span>Год:</span>

                            <div className={styles.arrow_buttons}>
                                <div style={{ display: "inline-block" }}>
                                    <button onClick={() => this.slideYear("prev", 10)}>
                                        {"<<"}
                                    </button>

                                    <button onClick={() => this.slideYear("prev", 1)}>
                                        {"<"}
                                    </button>
                                </div>

                                <span>{year}</span>

                                <div style={{ display: "inline-block" }}>
                                    <button onClick={() => this.slideYear("next", 1)}>
                                        {">"}
                                    </button>

                                    <button onClick={() => this.slideYear("next", 10)}>
                                        {">>"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th>вс</th>
                            <th>пн</th>
                            <th>вт</th>
                            <th>ср</th>
                            <th>чт</th>
                            <th>пт</th>
                            <th>сб</th>
                        </tr>
                        {weeks.map((week: string[], index) => (
                            <tr key={`week${index}`}>
                                {week.map((day, index) => {
                                    const cellClassNames = classNames({
                                        [styles.cell]: true,
                                        [styles.selected]: this.state.day === +day,
                                        [styles.disabled]: day === " "
                                    });

                                    return (
                                        <td key={`day${index}`}
                                            className={cellClassNames}
                                            onClick={() => this.setDay(day)}
                                        >
                                            {day}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.actions}>
                    <button onClick={this.props.onClose}>
                        CANCEL
                    </button>

                    <button onClick={this.setValue}>
                        ОК
                    </button>
                </div>
            </div>
        );
    }
}

export default DatePicker;
