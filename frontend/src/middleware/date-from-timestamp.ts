const monthList = [
    "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

export class DateFromTimestamp {
    private date: Date;
    constructor(timestamp: string) {
        this.date = new Date(+timestamp);
    }

    getTime = () => {
        let hours = `${this.date.getHours()}`;
        hours = hours.length < 2 ? `0${hours}` : hours;
        let minutes = `${this.date.getMinutes()}`;
        minutes = minutes.length < 2 ? `0${minutes}` : minutes;

        return `${hours}:${minutes}`;
    }

    getNumber = () => {
        return `${this.date.getDate()}`;
    }

    getDate = () => {
        let day = this.date.getDate();
        let month = monthList[this.date.getMonth()];

        return `${day} ${month}`;
    }

    getYear = () => {
        return `${this.date.getFullYear()}`;
    }
}