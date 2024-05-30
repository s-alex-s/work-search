"use client";

import React, {useContext, useEffect, useState} from "react";
import {Alert, App, Button, Form, FormInstance, Input, Modal, Space} from "antd";
import AuthContext, {AuthContextType} from "@/context/auth";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import {forgot_username, getUser, loginUser, resend_activation_user, reset_password} from "@/utils/auth";
import styles from './login.module.css';
import Link from "next/link";
import {MESSAGE_DURATION, PASSWORD_RULES, USERNAME_RULES} from "@/config";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";


type FieldType = {
    username: string;
    password: string;
};

type EmailFormType = {
    email: string;
};

type EmailFormProps = {
    onFormInstanceReady: (instance: FormInstance<EmailFormType>) => void
};

type ActionType = 'resend_activation_user' | 'reset_password' | 'forgot_username' | '';

type ModalProps = {
    open: boolean;
    onSubmit: (values: ValuesType, actionType: ActionType) => void;
    onCancel: () => void;
    actionType: ActionType
};

type ValuesType = {
    email: string
}

type Actions = {
    reset_password: typeof reset_password;
    forgot_username: typeof forgot_username;
    resend_activation_user: typeof resend_activation_user;
}

function FormModal({open, onSubmit, onCancel, actionType}: ModalProps) {
    const [formInstance, setFormInstance] = useState<FormInstance>();

    return (
        <Modal
            open={open}
            title="Введите почту которая привязанна к вашему аккаунту"
            okText="Отправить"
            cancelText="Отмена"
            onCancel={onCancel}
            destroyOnClose
            onOk={async () => {
                try {
                    const values = await formInstance?.validateFields();
                    formInstance?.resetFields();
                    onSubmit(values, actionType);
                } catch (error) {
                }
            }}
        >
            <EmailForm onFormInstanceReady={
                (instance) => {
                    setFormInstance(instance);
                }
            }
            />
        </Modal>
    )
}

function EmailForm({onFormInstanceReady}: EmailFormProps) {
    const [form] = Form.useForm<EmailFormType>();

    useEffect(() => {
        onFormInstanceReady(form);
    }, []);

    return (
        <Form
            className={styles.form}
            form={form}
        >
            <Form.Item<EmailFormType>
                hasFeedback
                name="email"
                rules={[{required: true}, {type: 'email', message: 'Некорректный формат эллектронной почты'}]}
            >
                <Input
                    prefix={<MailOutlined className={styles.login_icon_color}/>}
                    placeholder="Электронная почта"
                />
            </Form.Item>
        </Form>
    )
}

export default function LoginPage() {
    const context = useContext(AuthContext) as AuthContextType;
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm<FieldType>();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<ActionType>("");
    const {message} = App.useApp();
    const msgKey = 'status';
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

    function onSubmit(values: ValuesType, actionType: ActionType) {
        setOpen(false);
        if (actionType !== '') {
            message.open({
                key: msgKey,
                type: 'loading',
                content: 'Загрузка',
                duration: 0
            });

            actions[actionType](values.email).then(r => {
                if (r.ok) message.open({
                    duration: MESSAGE_DURATION,
                    key: msgKey,
                    type: 'success',
                    content: 'Ссылка отправлена'
                });

                if (r.status === 400) message.open({
                    duration: MESSAGE_DURATION,
                    key: msgKey,
                    type: 'error',
                    content: 'Аккаунта с такой почтой не существует'
                });
            });
        }
    }

    const actions: Actions = {
        reset_password,
        forgot_username,
        resend_activation_user,
    }

    if (isUserLoading) return <Loading/>
    return (
        <>
            <Form
                form={form}
                className={`${styles.login_form} central-form`}
                onFinish={values => {
                    setShowAlert(false);
                    setIsLoading(true);
                    loginUser(values as { username: string; password: string; })
                        .then(r => {
                            setShowAlert(!r);
                            if (r) {
                                context.setUser(r);
                                router.push('/');
                            }
                            setIsLoading(false);
                        });
                }}
                autoComplete="off">
                <Form.Item<FieldType>
                    name="username"
                    rules={USERNAME_RULES}>
                    <Input prefix={<UserOutlined className={styles.login_icon_color}/>}
                           placeholder="Имя пользователя"/>
                </Form.Item>

                <Form.Item<FieldType>
                    name="password"
                    rules={PASSWORD_RULES}>
                    <Input.Password prefix={<LockOutlined className={styles.login_icon_color}/>}
                                    placeholder="Пароль"/>
                </Form.Item>

                <Form.Item>
                    <Space direction="vertical" style={{width: "100%"}}>
                        <Button loading={isLoading} className={styles.button} type="primary" htmlType="submit">
                            Войти
                        </Button>
                        <div>Забыли <a onClick={() => {
                            setModalType('forgot_username');
                            setOpen(true);
                        }}>логин</a> или <a
                            onClick={() => {
                                setModalType('reset_password');
                                setOpen(true);
                            }}>пароль</a>?
                        </div>
                        <Link href="/registration"><Button
                            className={styles.button}>Зарегистрироваться</Button></Link>
                    </Space>
                </Form.Item>

                {showAlert ? <Alert
                    message="Ошибка авторизации"
                    type="error"
                    description={
                        <span>
                        Введены неправильные данные или не<a onClick={() => {
                            setModalType('resend_activation_user');
                            setOpen(true);
                        }}> актирован аккаунт</a>
                        </span>
                    }
                    showIcon/> : null}
            </Form>

            <FormModal open={open} actionType={modalType} onSubmit={onSubmit} onCancel={() => setOpen(false)}/>
        </>
    );
}
