"use client";

import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {App, Button, Divider, Form, Input, List, Modal} from "antd";
import styles from "./profile.module.css";
import AuthContext, {AuthContextType} from "@/context/auth";
import {
    DATE_FORMAT,
    FIRST_NAME_RULES,
    LAST_NAME_RULES,
    MESSAGE_DURATION,
    PASSWORD_LENGTH,
    PASSWORD_RULES,
    SMALL_TEXT_MAX_LENGTH
} from "@/config";
import moment from "moment";
import Link from "next/link";
import {change_user_info, change_user_password, deleteUser} from "@/utils/user";
import {getUserOrLogout, logoutUser} from "@/utils/client_auth";
import {UserDataType} from "@/utils/auth";
import {getFormErrors} from "@/utils/form";

type FirstNameFields = {
    first_name: string;
};

type LastNameFields = {
    last_name: string;
};

type ChangePasswordFields = {
    current_password: string;
    new_password: string;
    re_new_password: string;
};

type DeleteUserFields = {
    current_password: string;
}

export default function ProfilePage() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const {message} = App.useApp();
    const [formFirstName] = Form.useForm<FirstNameFields>();
    const [formLastName] = Form.useForm<LastNameFields>();
    const [formChangePassword] = Form.useForm<ChangePasswordFields>();
    const [formDeleteUser] = Form.useForm<DeleteUserFields>();

    const [openModal, setOpenModal] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);
    const [isChangeFirstNameLoading, setIsChangeFirstNameLoading] = useState(false);
    const [isChangeLastNameLoading, setIsChangeLastNameLoading] = useState(false);

    const [isFirstNameDiff, setIsFirstNameDiff] = useState(true);
    const [isLastNameDiff, setIsLastNameDiff] = useState(true);

    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                setIsUserLoading(false);
            }
        });
    }, []);

    if (isUserLoading) return <Loading/>
    return (
        <div className="centered_content">
            <Divider orientation='left'><h2>Профиль</h2></Divider>
            <List
                itemLayout="horizontal"
                bordered
            >
                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>E-mail</h3>
                    <h3>{context.user?.email}</h3>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Дата рождения</h3>
                    <h3>{moment(context.user?.birth_date).format(DATE_FORMAT)}</h3>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Пол</h3>
                    <h3>{context.user?.gender === 'm' ? 'Мужской' : 'Женский'}</h3>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Имя</h3>
                    <Form
                        layout="inline"
                        form={formFirstName}
                        initialValues={{first_name: context.user?.first_name}}
                        onFinish={async (values) => {
                            setIsChangeFirstNameLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_user_info(
                                get_user!.token,
                                values
                            );
                            setIsChangeFirstNameLoading(false);
                            if (!result) {
                                message.error('Ошибка', MESSAGE_DURATION);
                            } else {
                                setIsFirstNameDiff(true);
                                context.setUser({...get_user, first_name: values.first_name} as UserDataType);
                            }
                        }}
                    >
                        <Form.Item<FirstNameFields>
                            name="first_name"
                            rules={FIRST_NAME_RULES}
                        >
                            <Input
                                onChange={(e) => {
                                    setIsFirstNameDiff(e.target.value === context.user?.first_name);
                                }}
                                maxLength={SMALL_TEXT_MAX_LENGTH}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isFirstNameDiff}
                                loading={isChangeFirstNameLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Фамилия</h3>
                    <Form
                        layout="inline"
                        form={formLastName}
                        initialValues={{last_name: context.user?.last_name}}
                        onFinish={async (values) => {
                            setIsChangeLastNameLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_user_info(
                                get_user!.token,
                                values
                            );
                            setIsChangeLastNameLoading(false);
                            if (!result) {
                                message.error('Ошибка', MESSAGE_DURATION);
                            } else {
                                setIsLastNameDiff(true);
                                context.setUser({...get_user, last_name: values.last_name} as UserDataType);
                            }
                        }}
                    >
                        <Form.Item<LastNameFields>
                            name="last_name"
                            rules={LAST_NAME_RULES}
                        >
                            <Input
                                onChange={(e) => {
                                    setIsLastNameDiff(e.target.value === context.user?.last_name);
                                }}
                                maxLength={SMALL_TEXT_MAX_LENGTH}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isLastNameDiff}
                                loading={isChangeLastNameLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Form
                        form={formChangePassword}
                        className={styles.form}
                        onFinish={async (values) => {
                            setIsChangePasswordLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_user_password(
                                values,
                                get_user!.token
                            );
                            setIsChangePasswordLoading(false);
                            if (result) {
                                getFormErrors(result, formChangePassword);
                            } else {
                                message.success('Пароль изменён', MESSAGE_DURATION);
                                formChangePassword.resetFields();
                            }
                        }}
                    >
                        <Form.Item<ChangePasswordFields>
                            name="current_password"
                            hasFeedback
                            rules={PASSWORD_RULES}
                        >
                            <Input.Password placeholder="Текущий пароль" maxLength={PASSWORD_LENGTH.max}/>
                        </Form.Item>

                        <Form.Item<ChangePasswordFields>
                            name="new_password"
                            hasFeedback
                            rules={PASSWORD_RULES}
                        >
                            <Input.Password placeholder="Новый пароль" maxLength={PASSWORD_LENGTH.max}/>
                        </Form.Item>

                        <Form.Item<ChangePasswordFields>
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
                            <Input.Password placeholder="Повторите новый пароль" maxLength={PASSWORD_LENGTH.max}/>
                        </Form.Item>

                        <Form.Item>
                            <Button style={{float: 'right'}} loading={isChangePasswordLoading} type="primary"
                                    htmlType="submit">
                                Изменить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>
            </List>

            <Divider orientation="left" style={{marginBottom: 80}}>
                <Link
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenModal(true);
                    }}
                >
                    Удалить аккаунт
                </Link>
            </Divider>

            <Modal
                open={openModal}
                confirmLoading={isModalLoading}
                title="Удаление аккаунта"
                okText="Удалить"
                cancelText="Отмена"
                okButtonProps={{autoFocus: true, htmlType: 'submit'}}
                destroyOnClose
                onCancel={() => {
                    formDeleteUser.resetFields();
                    setOpenModal(false);
                }}
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={formDeleteUser}
                        onFinish={async (values) => {
                            setIsModalLoading(true);
                            try {
                                const token = (await getUserOrLogout(context, router))?.token;
                                if (await deleteUser(token!, values!.current_password)) {
                                    message.success('Ваш аккаунт удалён', MESSAGE_DURATION);
                                    await logoutUser(context, router);
                                } else {
                                    formDeleteUser?.setFields([
                                        {
                                            name: 'current_password',
                                            errors: ['Неверный пароль']
                                        }
                                    ]);
                                }
                            } catch (error) {
                            }
                            setIsModalLoading(false);
                        }}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item<DeleteUserFields>
                    name="current_password"
                    label="Введите текущий пароль"
                    hasFeedback
                    rules={PASSWORD_RULES}
                >
                    <Input.Password maxLength={PASSWORD_LENGTH.max}/>
                </Form.Item>
            </Modal>
        </div>
    )
}
