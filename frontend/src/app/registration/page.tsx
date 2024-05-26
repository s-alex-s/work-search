"use client";

import {App, Button, Form, FormInstance, Input, Result} from "antd";
import React, {useEffect, useState} from "react";
import {getUser, registerUser, resendActivation} from "@/utils/auth";

import styles from './registration.module.css';
import Link from "next/link";
import {MESSAGE_DURATION, PASSWORD_RULES, USERNAME_RULES} from "@/config";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";

type FieldType = {
    first_name: string;
    last_name: string;
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
    const [disabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState('Отправить ещё раз');
    let seconds = 30;
    let sec_text = 'секунд';

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
            setButtonText(buttonText + ` через ${seconds} ${sec_text}`);
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            setButtonText('Отправить ещё раз');
            setDisabled(false);
        }, seconds * 1000);
    }

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
    });

    function onFinish(val: object | null) {
        setButtonLoading(false);
        if (val) {
            const key = Object.keys(val)[0];
            form.setFields([
                {
                    name: key,
                    // @ts-ignore
                    errors: val[key]
                }
            ]);
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
                registerUser(values).then(onFinish);
            }}
            autoComplete="off">

            <Form.Item<FieldType>
                label="Имя"
                name="first_name"
                rules={[{required: true, type: 'string', message: 'Пожалуйста, введите своё имя'},
                    () => ({
                            validator(_, value) {
                                if (!value || [...value].every(char => isNaN(char))) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Имя должно состоять только из букв'));
                            }
                        }
                    )
                ]}>
                <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Фамилия"
                name="last_name"
                rules={[{required: true, type: 'string', message: 'Пожалуйста, введите свою фамилию'},
                    () => ({
                            validator(_, value) {
                                if (!value || [...value].every(char => isNaN(char))) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Фамилия должна состоять только из букв'));
                            }
                        }
                    )
                ]}>
                <Input/>
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
                rules={[{required: true}, {type: 'email', message: 'Некорректный формат эллектронной почты'}]}>
                <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Пароль"
                name="password"
                hasFeedback
                rules={PASSWORD_RULES}>
                <Input.Password/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Повторите пароль"
                name="re_password"
                hasFeedback
                dependencies={['password']}
                rules={[
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
                ]}>
                <Input.Password/>
            </Form.Item>

            <Form.Item>
                <SubmitButton form={form} loading={buttonLoading}>
                    Зарегистрироваться
                </SubmitButton>
                Или <Link href="/login">авторизоваться</Link>
            </Form.Item>
        </Form>
    );
}
