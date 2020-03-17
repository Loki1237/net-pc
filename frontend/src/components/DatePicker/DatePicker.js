import React from 'react';
import styles from './DatePicker.css';
import _ from 'lodash';

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

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: 1970,
            month: 0,
            day: 1,
            monthName: monthNames[0],
            dayName: dayNames[0],
            weeks: []
        };
    }

    componentDidMount() {
        const year, month, day;

        if (this.props.value) {
            const [d, m, y] = this.props.value.split(".");
            year = +y;
            month = +m - 1;
            day = +d;
        } else if (this.props.maxYear) {
            year = this.props.maxYear;
            month = 0;
            day = 1;
        } else {
            const date = new Date();
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }

        const dayName = new Date(year, month, day).getDay();
        this.setState({ year, month, day, monthName: monthNames[month], dayName: dayNames[dayName] });
        this.updateTable(year, month);
    }

    setValue = () => {
        const { year, month, monthName, day } = this.state;
        month++;

        day = day >= 10 ? day : `0${day}`;
        month = month >= 10 ? month : `0${month}`;

        this.props.onChange(`${day}.${month}.${year}`);
        this.props.onClose();
    }

    setDay = (day) => {
        const { year, month } = this.state;
        const selectedDate = new Date(year, month, day);

        if (day === " ") return;

        this.setState({ 
            day,
            dayName: dayNames[selectedDate.getDay()]
        });
    }

    slideMonth = (direction) => {
        const { year, month, day, monthName } = this.state;
        const newMonth;

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

        this.setState({ month: newMonth, day: 1, monthName: monthNames[newMonth] });
        this.updateTable(year, newMonth);
    }

    slideYear = (direction, count) => {
        const currentYear = new Date().getFullYear();
        const min = this.props.minYear || currentYear + 100;
        const max = this.props.maxYear || currentYear + 100;
        const { year, month } = this.state;
        const newYear;

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

    updateTable = (year, month) => {
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
            dayArray.push(date.getDate());
        }

        let a = 42 - dayArray.length;
        for (let i = 0; i < a; i++) {
            dayArray.push(" ");
        }

        this.setState({ weeks: _.chunk(dayArray, 7) });
    }

    render() {
        const { year, month, day, monthName, dayName, weeks } = this.state;

        return (
            <div className={`${styles.DatePicker}
                ${this.props.open && styles.opened}`}
            >
                <div className={styles.header}>
                    <p>
                        {`${dayName}, ${day} ${monthName.substr(0, 3)} ${year}`}
                    </p>

                    <div className={styles.selectors}>
                        <div className={styles.selector}>
                            <button onClick={() => this.slideMonth("prev")}>
                                {"<"}
                            </button>

                            <span>{monthName}</span>

                            <button onClick={() => this.slideMonth("next")}>
                                {">"}
                            </button>
                        </div>

                        <div className={styles.selector}>
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
                        {weeks.map((week, index) => (
                            <tr key={`week${index}`}>
                                {week.map((day, index) => (
                                    <td key={`day${index}`}
                                        className={`${styles.cell} 
                                            ${this.state.day === day ? styles.selected : ""}
                                            ${day === " " ? styles.disabled : ""}
                                        `}
                                        onClick={() => this.setDay(day)}
                                    >
                                        {day}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.actions}>
                    <button onClick={this.props.onClose}>
                        Cancel
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
