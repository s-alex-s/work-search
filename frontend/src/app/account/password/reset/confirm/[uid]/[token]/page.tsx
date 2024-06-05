"use client";

import {App, Button, Form, Input, Result} from "antd";
import {MESSAGE_DURATION, PASSWORD_LENGTH, PASSWORD_RULES} from "@/config";
import {useState} from "react";
import {reset_password_confirm} from "@/utils/user";
import Link from "next/link";

function Success() {
    return (
        <Result
            status="success"
            title="Пароль изменён"
            subTitle={'Пароль вашего аккаунта успешно изменён.'}
            extra={[
                <Link key="to_login" href="/login"><Button>Перейти на страницу авторизации</Button></Link>
            ]}
        />
    )
}

type FieldType = {
    'new_password': string;
    're_new_password': string;
}

export default function ResetPasswordPage({params}: { params: { uid: string, token: string } }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const {message} = App.useApp();

    if (isSuccess) return <Success/>
    return (
        <Form
            style={{maxWidth: '350px'}}
            className={'central-form'}
            onFinish={(values) => {
                setIsLoading(true);
                reset_password_confirm(
                    params.uid,
                    params.token,
                    values.new_password,
                    values.re_new_password
                ).then(r => {
                    setIsLoading(false);
                    if (!r) {
                        message.error('Ошибка', MESSAGE_DURATION);
                    } else {
                        setIsSuccess(true);
                    }
                });
            }}
        >
            <Form.Item<FieldType>
                name="new_password"
                hasFeedback
                rules={PASSWORD_RULES}
            >
                <Input.Password placeholder="Новый пароль" maxLength={PASSWORD_LENGTH.max}/>
            </Form.Item>

            <Form.Item<FieldType>
                name="re_new_password"
                hasFeedback
                dependencies={['new_password']}
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, повторно введите пароль'
                    },
                    ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают'));
                            }
                        }
                    )
                ]}
            >
                <Input.Password placeholder="Повторите пароль" maxLength={PASSWORD_LENGTH.max}/>
            </Form.Item>

            <Form.Item>
                <Button loading={isLoading} style={{width: '100%'}} type="primary"
                        htmlType="submit">Отправить</Button>
            </Form.Item>
        </Form>
    )
}
