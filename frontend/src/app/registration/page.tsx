"use client";

import {App, Button, DatePicker, Form, FormInstance, Input, Result, Select} from "antd";
import React, {useEffect, useState} from "react";
import {getUser, registerUser, resendActivation} from "@/utils/auth";

import styles from './registration.module.css';
import Link from "next/link";
import {
    EMAIL_LENGTH,
    FIRST_NAME_RULES,
    LAST_NAME_RULES,
    MESSAGE_DURATION,
    PASSWORD_LENGTH,
    PASSWORD_RULES,
    RE_PASSWORD_RULES,
    USER_BIRTH_DATE_RULES,
    USERNAME_RULES
} from "@/config";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {getFormErrors} from "@/utils/form";

type FieldType = {
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: 'm' | 'f';
    email: string;
    username: string;
    password: string;
    re_password: string;
}

function SubmitButton({form, loading, children}: { form: FormInstance, loading: boolean, children: React.ReactNode }) {
    const [submittable, setSubmittable] = useState(true);

    const values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({validateOnly: true})
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false))
    }, [form, values]);

    return (
        <Button className={styles.button} loading={loading} type="primary" htmlType="submit" disabled={!submittable}>
            {children}
        </Button>
    )
}

function Success({email}: { email: string }) {
    const {message} = App.useApp();
    const msg = `На почту ${email} была отправлена ссылка для активации аккаунта`;
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    let seconds = 30;
    let sec_text = 'секунд';
    let base_text = 'Отправить ещё раз';
    const [buttonText, setButtonText] = useState(base_text + ` через ${seconds} ${sec_text}`);

    function success() {
        message.success('Ссылка отправлена', MESSAGE_DURATION);

        const timer = setInterval(() => {
            seconds -= 1;
            if (1 < seconds && seconds < 5) {
                sec_text = 'секунды';
            } else if (seconds === 1) {
                sec_text = 'секунду';
            } else {
                sec_text = 'секунд';
            }
            setButtonText(base_text + ` через ${seconds} ${sec_text}`);
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            setButtonText(base_text);
            setDisabled(false);
        }, seconds * 1000);
    }

    useEffect(() => {
        success();
    }, []);

    return <Result
        status="success"
        title="Аккаунт успешно зарегистрирован! Осталось его активировать"
        subTitle={msg}
        extra={[
            <Button disabled={disabled} loading={isLoading} key="again" onClick={() => {
                setIsLoading(true);
                resendActivation(email)
                    .then(r => {
                        setDisabled(true);
                        setButtonText(buttonText + ` через ${seconds} ${sec_text}`);
                        setIsLoading(false);
                        r ? success() : message.error('Ошибка', MESSAGE_DURATION);
                    });
            }}>
                {buttonText}
            </Button>
        ]}
    />
}

export default function RegistrationPage() {
    const [form] = Form.useForm<FieldType>();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        getUser().then(r => {
            if (r) {
                router.push('/');
            } else {
                setIsUserLoading(false);
            }
        });
    }, []);

    function onFinish(val: object | null) {
        setButtonLoading(false);
        if (val) {
            getFormErrors(val, form);
        } else {
            setIsSuccess(true);
        }
    }

    if (isUserLoading) return <Loading/>;
    if (isSuccess) return <Success email={form.getFieldValue('email')}/>;
    return (
        <Form
            layout="vertical"
            className={`${styles.registration_form} central-form`}
            form={form}
            onFinish={values => {
                setButtonLoading(true);
                // @ts-ignore
                const $M = values.birth_date.$M + 1;
                // @ts-ignore
                values.birth_date = `${values.birth_date.$y}-${$M + 1 < 10 ? `0${$M}` : `${$M}`}-${values.birth_date.$D}`;
                registerUser(values).then(onFinish);
            }}
            autoComplete="off">
            <h2 style={{marginTop: 0}}>Зарегистрируйтесь</h2>

            <Form.Item<FieldType>
                label="Имя"
                name="first_name"
                rules={FIRST_NAME_RULES}>
                <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Фамилия"
                name="last_name"
                rules={LAST_NAME_RULES}>
                <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Дата рождения"
                name="birth_date"
                rules={USER_BIRTH_DATE_RULES}
            >
                <DatePicker
                    style={{width: '100%'}}
                    format={'DD.MM.YYYY'}
                    allowClear={false}
                    placeholder=""
                />
            </Form.Item>

            <Form.Item<FieldType>
                label="Пол"
                name="gender"
                rules={[
                    {required: true, message: 'Укажите свой пол'}
                ]}
            >
                <Select
                    options={[
                        {value: 'm', label: 'Мужской'},
                        {value: 'f', label: 'Женский'}
                    ]}
                />
            </Form.Item>

            <Form.Item<FieldType>
                label="Имя пользователя"
                name="username"
                rules={USERNAME_RULES}>
                <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="E-mail"
                name="email"
                hasFeedback
                rules={[
                    {required: true},
                    {type: 'email', message: 'Некорректный формат эллектронной почты'}
                ]}>
                <Input maxLength={EMAIL_LENGTH}/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Пароль"
                name="password"
                hasFeedback
                rules={PASSWORD_RULES}>
                <Input.Password maxLength={PASSWORD_LENGTH.max}/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Повторите пароль"
                name="re_password"
                hasFeedback
                dependencies={['password']}
                rules={RE_PASSWORD_RULES}>
                <Input.Password maxLength={PASSWORD_LENGTH.max}/>
            </Form.Item>

            <Form.Item>
                <SubmitButton form={form} loading={buttonLoading}>
                    Зарегистрироваться
                </SubmitButton>
                Или <Link href="/login">войти</Link>
            </Form.Item>
        </Form>
    );
}
