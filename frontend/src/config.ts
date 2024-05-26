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
    }];

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
