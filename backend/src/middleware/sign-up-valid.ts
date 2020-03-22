interface UserDataType {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: string,
    birthday: string,
    country: string,
    city: string
}

export default class DataValidation {
    templates = {
            simple: /[^a-zа-я-]/i,
            gender: /^(male|female)$/,
            birthday: /^(\d{2}.\d{2}.\d{4})$/,
            email: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i,
            password: /[^a-z0-9_-]/i
        }

    public async validate(data: UserDataType): Promise<any> {
        const templates = this.templates;

        if (templates.simple.test(data.firstName)) {
            throw new Error("Incorrect name");
        }

        if (templates.simple.test(data.lastName)) {
            throw new Error("Incorrect surname");
        }

        if (!templates.gender.test(data.gender)) {
            throw new Error("Incorrect gender");
        }

        if (!templates.birthday.test(data.birthday)) {
            throw new Error("Incorrect birthday");
        }

        if (templates.simple.test(data.country)) {
            throw new Error("Incorrect country");
        }

        if (templates.simple.test(data.city)) {
            throw new Error("Incorrect city");
        }

        if (!templates.email.test(data.email)) {
            throw new Error("Incorrect email");
        }

        if (templates.password.test(data.password)) {
            throw new Error("Incorrect password");
        }

        if (data.password.length < 8) {
            throw new Error("Very short password");
        }

        return true;
    }
}
