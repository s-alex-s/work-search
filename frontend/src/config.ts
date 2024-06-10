import {Rule, RuleObject} from "rc-field-form/es/interface";
import {isValidPhoneNumber} from "libphonenumber-js";
import {DefaultOptionType} from "rc-select/es/Select";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const display_salary = (item: { salary: number, salary_currency: string }) => {
    return new Intl.NumberFormat('ru', {
        style: 'currency',
        currency: item.salary_currency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0
    }).format(item.salary)
}

export const ACCESS_TOKEN_LIFETIME = 60_000 * 10;
export const REFRESH_TOKEN_LIFETIME = 60_000 * 60 * 24 * 2;
export const DEFAULT_LIFETIME = 60_000 * 60 * 24 * 30;

export const PASSWORD_LENGTH = {
    min: 8,
    max: 128,
};

export const PHONE_NUMBER_LENGTH = {
    min: 10,
    max: 10
};

export const MESSAGE_DURATION = 4;

export const NO_HEADER_PAGES = new RegExp('/account/activate/');

export const TEXT_MAX_LENGTH = 2000;
export const SMALL_TEXT_MAX_LENGTH = 250;
export const USERNAME_LENGTH = 150;
export const EMAIL_LENGTH = 254;
export const VACANCY_TITLE_LENGTH = 100;

export const PHONE_NUMBER_RULES = [
    {
        ...PHONE_NUMBER_LENGTH,
        message: 'Количество цифр в номере должно составлять 10'
    },
    () => ({
        validator(_, value) {
            if (!value) return Promise.resolve();
            if (value.length !== 10 || isValidPhoneNumber(value, "KZ")) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error("Некорректный номер телефона"));
            }
        }
    })
] as Rule[];

export const PASSWORD_RULES = [
    {
        required: true,
        message: 'Введите пароль'
    },
    {
        ...PASSWORD_LENGTH,
        message: `Длина пароля должна быть между ${PASSWORD_LENGTH.min}-${PASSWORD_LENGTH.max} символами`
    }
];
export const RE_PASSWORD_RULES = [
    {
        required: true,
        message: 'Повторно введите пароль'
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

export const USERNAME_RULES = [
    {required: true, type: 'string', message: 'Введите имя пользователя'},
    {
        max: USERNAME_LENGTH,
        message: `Длина имени пользователя не должна превышать ${USERNAME_LENGTH} символов`
    },
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

export const DATE_FORMAT = 'D MMM YYYY';
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
        type: 'string', message: 'Введите своё имя'
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
        message: 'Введите свою фамилию'
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

export const CURRENCIES = [
    {label: '₸', value: 'KZT'},
    {label: '₽', value: 'RUB'},
    {label: '¥', value: 'CNY'},
    {label: '$', value: 'USD'},
    {label: '€', value: 'EUR'},
] as DefaultOptionType[];

export const CURRENCY_LENGTH = 10;

const COUNTRIES_UNORDERED = {
    "AF": "Афганистан",
    "AX": "Аландские острова",
    "AL": "Албания",
    "DZ": "Алжир",
    "AS": "Американское Самоа",
    "AD": "Андорра",
    "AO": "Ангола",
    "AI": "Ангилья",
    "AQ": "Антарктида",
    "AG": "Антигуа и Барбуда",
    "AR": "Аргентина",
    "AM": "Армения",
    "AW": "Аруба",
    "AU": "Австралия",
    "AT": "Австрия",
    "AZ": "Азербайджан",
    "BS": "Багамы",
    "BH": "Бахрейн",
    "BD": "Бангладеш",
    "BB": "Барбадос",
    "BY": "Беларусь",
    "BE": "Бельгия",
    "BZ": "Белиз",
    "BJ": "Бенин",
    "BM": "Бермуды",
    "BT": "Бутан",
    "BO": "Боливия",
    "BQ": "Бонайре, Синт-Эстатиус и Саба",
    "BA": "Босния и Герцеговина",
    "BW": "Ботсвана",
    "BV": "Остров Буве",
    "BR": "Бразилия",
    "IO": "Британская территория в Индийском океане",
    "BN": "Бруней-Даруссалам",
    "BG": "Болгария",
    "BF": "Буркина-Фасо",
    "BI": "Бурунди",
    "CV": "Кабо-Верде",
    "KH": "Камбоджа",
    "CM": "Камерун",
    "CA": "Канада",
    "KY": "Каймановы острова",
    "CF": "Центральноафриканская Республика",
    "TD": "Чад",
    "CL": "Чили",
    "CN": "Китай",
    "CX": "Остров Рождества",
    "CC": "Кокосовые острова",
    "CO": "Колумбия",
    "KM": "Коморы",
    "CG": "Конго",
    "CD": "Демократическая Республика Конго",
    "CK": "Острова Кука",
    "CR": "Коста-Рика",
    "CI": "Кот-д'Ивуар",
    "HR": "Хорватия",
    "CU": "Куба",
    "CW": "Кюрасао",
    "CY": "Кипр",
    "CZ": "Чехия",
    "DK": "Дания",
    "DJ": "Джибути",
    "DM": "Доминика",
    "DO": "Доминиканская Республика",
    "EC": "Эквадор",
    "EG": "Египет",
    "SV": "Сальвадор",
    "GQ": "Экваториальная Гвинея",
    "ER": "Эритрея",
    "EE": "Эстония",
    "SZ": "Эсватини",
    "ET": "Эфиопия",
    "FK": "Фолклендские острова (Мальвинские)",
    "FO": "Фарерские острова",
    "FJ": "Фиджи",
    "FI": "Финляндия",
    "FR": "Франция",
    "GF": "Французская Гвиана",
    "PF": "Французская Полинезия",
    "TF": "Французские Южные территории",
    "GA": "Габон",
    "GM": "Гамбия",
    "GE": "Грузия",
    "DE": "Германия",
    "GH": "Гана",
    "GI": "Гибралтар",
    "GR": "Греция",
    "GL": "Гренландия",
    "GD": "Гренада",
    "GP": "Гваделупа",
    "GU": "Гуам",
    "GT": "Гватемала",
    "GG": "Гернси",
    "GN": "Гвинея",
    "GW": "Гвинея-Бисау",
    "GY": "Гайана",
    "HT": "Гаити",
    "HM": "Остров Херд и Острова Макдональд",
    "VA": "Святой Престол (Ватикан)",
    "HN": "Гондурас",
    "HK": "Гонконг",
    "HU": "Венгрия",
    "IS": "Исландия",
    "IN": "Индия",
    "ID": "Индонезия",
    "IR": "Иран",
    "IQ": "Ирак",
    "IE": "Ирландия",
    "IM": "Остров Мэн",
    "IL": "Израиль",
    "IT": "Италия",
    "JM": "Ямайка",
    "JP": "Япония",
    "JE": "Джерси",
    "JO": "Иордания",
    "KZ": "Казахстан",
    "KE": "Кения",
    "KI": "Кирибати",
    "KP": "КНДР",
    "KR": "Республика Корея",
    "KW": "Кувейт",
    "KG": "Киргизия",
    "LA": "Лаос",
    "LV": "Латвия",
    "LB": "Ливан",
    "LS": "Лесото",
    "LR": "Либерия",
    "LY": "Ливия",
    "LI": "Лихтенштейн",
    "LT": "Литва",
    "LU": "Люксембург",
    "MO": "Макао",
    "MG": "Мадагаскар",
    "MW": "Малави",
    "MY": "Малайзия",
    "MV": "Мальдивы",
    "ML": "Мали",
    "MT": "Мальта",
    "MH": "Маршалловы Острова",
    "MQ": "Мартиника",
    "MR": "Мавритания",
    "MU": "Маврикий",
    "YT": "Майотта",
    "MX": "Мексика",
    "FM": "Федеративные Штаты Микронезии",
    "MD": "Молдавия",
    "MC": "Монако",
    "MN": "Монголия",
    "ME": "Черногория",
    "MS": "Монтсеррат",
    "MA": "Марокко",
    "MZ": "Мозамбик",
    "MM": "Мьянма",
    "NA": "Намибия",
    "NR": "Науру",
    "NP": "Непал",
    "NL": "Нидерланды",
    "NC": "Новая Каледония",
    "NZ": "Новая Зеландия",
    "NI": "Никарагуа",
    "NE": "Нигер",
    "NG": "Нигерия",
    "NU": "Ниуэ",
    "NF": "Остров Норфолк",
    "MK": "Северная Македония",
    "MP": "Северные Марианские острова",
    "NO": "Норвегия",
    "OM": "Оман",
    "PK": "Пакистан",
    "PW": "Палау",
    "PS": "Палестина",
    "PA": "Панама",
    "PG": "Папуа - Новая Гвинея",
    "PY": "Парагвай",
    "PE": "Перу",
    "PH": "Филиппины",
    "PN": "Питкэрн",
    "PL": "Польша",
    "PT": "Португалия",
    "PR": "Пуэрто-Рико",
    "QA": "Катар",
    "RE": "Реюньон",
    "RO": "Румыния",
    "RU": "Россия",
    "RW": "Руанда",
    "BL": "Сен-Бартелеми",
    "SH": "Острова Святой Елены, Вознесения и Тристан-да-Кунья",
    "KN": "Сент-Китс и Невис",
    "LC": "Сент-Люсия",
    "MF": "Сен-Мартен",
    "PM": "Сен-Пьер и Микелон",
    "VC": "Сент-Винсент и Гренадины",
    "WS": "Самоа",
    "SM": "Сан-Марино",
    "ST": "Сан-Томе и Принсипи",
    "SA": "Саудовская Аравия",
    "SN": "Сенегал",
    "RS": "Сербия",
    "SC": "Сейшелы",
    "SL": "Сьерра-Леоне",
    "SG": "Сингапур",
    "SX": "Синт-Мартен",
    "SK": "Словакия",
    "SI": "Словения",
    "SB": "Соломоновы острова",
    "SO": "Сомали",
    "ZA": "Южная Африка",
    "GS": "Южная Георгия и Южные Сандвичевы острова",
    "SS": "Южный Судан",
    "ES": "Испания",
    "LK": "Шри-Ланка",
    "SD": "Судан",
    "SR": "Суринам",
    "SJ": "Шпицберген и Ян-Майен",
    "SE": "Швеция",
    "CH": "Швейцария",
    "SY": "Сирия",
    "TW": "Тайвань",
    "TJ": "Таджикистан",
    "TZ": "Танзания",
    "TH": "Таиланд",
    "TL": "Тимор-Лешти",
    "TG": "Того",
    "TK": "Токелау",
    "TO": "Тонга",
    "TT": "Тринидад и Тобаго",
    "TN": "Тунис",
    "TR": "Турция",
    "TM": "Туркмения",
    "TC": "Теркс и Кайкос",
    "TV": "Тувалу",
    "UG": "Уганда",
    "UA": "Украина",
    "AE": "ОАЭ",
    "GB": "Великобритания",
    "UM": "Малые Тихоокеанские отдаленные острова США",
    "US": "США",
    "UY": "Уругвай",
    "UZ": "Узбекистан",
    "VU": "Вануату",
    "VE": "Венесуэла",
    "VN": "Вьетнам",
    "VG": "Виргинские острова (Британские)",
    "VI": "Виргинские острова (США)",
    "WF": "Уоллис и Футуна",
    "EH": "Западная Сахара",
    "YE": "Йемен",
    "ZM": "Замбия",
    "ZW": "Зимбабве",
}

export const COUNTRIES = Object.fromEntries(
    Object.entries(COUNTRIES_UNORDERED).sort((a, b) => {
        const nameA = a[1].toLowerCase();
        const nameB = b[1].toLowerCase();

        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        return 0;
    })
);

export const COUNTRIES_OPTIONS = Array.from(
    {length: Object.keys(COUNTRIES).length},
    (_, i) => {
        return {
            value: Object.keys(COUNTRIES)[i],
            label: COUNTRIES[Object.keys(COUNTRIES)[i]]
        };
    });
