import {Rule, RuleObject} from "rc-field-form/es/interface";

export const ACCESS_TOKEN_LIFETIME = 60_000 * 5;
export const REFRESH_TOKEN_LIFETIME = 60_000 * 60 * 24;
export const DEFAULT_LIFETIME = 60_000 * 60 * 24 * 30;

export const MESSAGE_DURATION = 4;

export const NO_HEADER_PAGES = new RegExp('/account/activate/');

export const PASSWORD_RULES = [
    {
        required: true,
        message: 'Пожалуйста, введите пароль'
    },
    {
        min: 8,
        max: 50,
        message: 'Длина пароля должна быть между 8-50 символами'
    }
];
export const RE_PASSWORD_RULES = [
    {
        required: true,
        message: 'Пожалуйста, повторно введите пароль'
    },
    ({getFieldValue}) => ({
            validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
            }
        }
    )
] as Rule[];

export const USERNAME_RULES = [{required: true, type: 'string', message: 'Пожалуйста, введите имя пользователя'},
    () => ({
            validator(_: RuleObject, value: string) {
                if (!value || /^[a-zA-Z0-9]+$/.test(value)) {
                    return Promise.resolve();
                }
                return Promise.reject(
                    new Error('Имя может состоять только из латинских букв или цифр'));
            }
        }
    )
] as Rule[];

export const DATE_FORMAT = 'DD.MM.YYYY';
export const USER_BIRTH_DATE_RULES = [
    {required: true, message: 'Укажите дату своего рождения'},
    () => ({
        validator(_: RuleObject, value: Date) {
            const currentDate = new Date();
            const birthDate = new Date(value);
            currentDate.setFullYear(currentDate.getFullYear() - 18);

            if (birthDate <= currentDate) return Promise.resolve();
            return Promise.reject(
                new Error('Вам не исполнилось 18 лет')
            );
        }
    })
] as Rule[];

export const FIRST_NAME_RULES = [
    {
        required: true,
        type: 'string', message: 'Пожалуйста, введите своё имя'
    },
    () => ({
            validator(_, value) {
                if (!value || [...value].every(char => isNaN(char))) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('Имя должно состоять только из букв'));
            }
        }
    )
] as Rule[];

export const LAST_NAME_RULES = [
    {
        required: true,
        type: 'string',
        message: 'Пожалуйста, введите свою фамилию'
    },
    () => ({
            validator(_, value) {
                if (!value || [...value].every(char => isNaN(char))) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('Фамилия должна состоять только из букв'));
            }
        }
    )
] as Rule[];
