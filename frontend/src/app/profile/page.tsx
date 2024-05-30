"use client";

import {useContext, useEffect, useState} from "react";
import {change_user_info, change_user_password, getUser} from "@/utils/auth";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {App, Button, Divider, Form, Input, List} from "antd";
import styles from "./profile.module.css";
import AuthContext, {AuthContextType} from "@/context/auth";
import {DATE_FORMAT, FIRST_NAME_RULES, LAST_NAME_RULES, PASSWORD_RULES} from "@/config";
import moment from "moment";

export default function ProfilePage() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const {message} = App.useApp();
    const [formFirstName] = Form.useForm();
    const [formLastName] = Form.useForm();
    const [formChangePassword] = Form.useForm();

    const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);
    const [isChangeFirstNameLoading, setIsChangeFirstNameLoading] = useState(false);
    const [isChangeLastNameLoading, setIsChangeLastNameLoading] = useState(false);

    const [isFirstNameDiff, setIsFirstNameDiff] = useState(true);
    const [isLastNameDiff, setIsLastNameDiff] = useState(true);

    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        getUser().then(r => {
            if (!r) {
                router.push('/login');
            } else {
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
                    <h3>{context.user!.email}</h3>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Дата рождения</h3>
                    <h3>{moment(context.user!.birth_date).format(DATE_FORMAT)}</h3>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Пол</h3>
                    <h3>{context.user!.gender === 'm' ? 'Мужской' : 'Женский'}</h3>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Имя</h3>
                    <Form
                        layout="inline"
                        form={formFirstName}
                        initialValues={{'first_name': context.user!.first_name}}
                        onFinish={() => {
                            setIsChangeFirstNameLoading(true);
                            getUser().then(get_user => {
                                change_user_info(
                                    get_user!.token,
                                    formFirstName.getFieldValue('first_name')
                                ).then(r => {
                                    setIsChangeFirstNameLoading(false);
                                    if (!r) {
                                        message.error('Ошибка');
                                    } else {
                                        message.success('Имя изменено');
                                        setIsFirstNameDiff(true);
                                        context.setUser(Object.assign(
                                            {},
                                            Object.assign(
                                                get_user!,
                                                {
                                                    first_name: formFirstName.getFieldValue('first_name')
                                                }
                                            )));
                                    }
                                });
                            });
                        }}
                    >
                        <Form.Item
                            name="first_name"
                            rules={FIRST_NAME_RULES}
                        >
                            <Input
                                onChange={(e) => {
                                    setIsFirstNameDiff(e.target.value === context.user!.first_name);
                                }}
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
                        initialValues={{'last_name': context.user!.last_name}}
                        onFinish={() => {
                            setIsChangeLastNameLoading(true);
                            getUser().then(get_user => {
                                change_user_info(
                                    get_user!.token,
                                    get_user!.first_name,
                                    formLastName.getFieldValue('last_name')
                                ).then(r => {
                                    setIsChangeLastNameLoading(false);
                                    if (!r) {
                                        message.error('Ошибка');
                                    } else {
                                        message.success('Фамилия изменена');
                                        setIsLastNameDiff(true);
                                        context.setUser(Object.assign(
                                            {},
                                            Object.assign(
                                                get_user!,
                                                {
                                                    last_name: formLastName.getFieldValue('last_name')
                                                }
                                            )));
                                    }
                                });
                            });
                        }}
                    >
                        <Form.Item
                            name="last_name"
                            rules={LAST_NAME_RULES}
                        >
                            <Input
                                onChange={(e) => {
                                    setIsLastNameDiff(e.target.value === context.user!.last_name);
                                }}
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
                        onFinish={(values) => {
                            setIsChangePasswordLoading(true);
                            getUser().then(get_user => {
                                change_user_password(
                                    values.new_password,
                                    values.re_new_password,
                                    values.current_password,
                                    get_user!.token
                                ).then(r => {
                                    setIsChangePasswordLoading(false);
                                    if (r) {
                                        const key = Object.keys(r)[0];
                                        formChangePassword.setFields([
                                            {
                                                name: key,
                                                // @ts-ignore
                                                errors: r[key]
                                            }
                                        ]);
                                    } else {
                                        message.success('Пароль изменён');
                                        formChangePassword.resetFields();
                                    }
                                });
                            });
                        }}
                    >
                        <Form.Item
                            name="current_password"
                            hasFeedback
                            rules={PASSWORD_RULES}
                        >
                            <Input.Password placeholder="Текущий пароль"/>
                        </Form.Item>

                        <Form.Item
                            name="new_password"
                            hasFeedback
                            rules={PASSWORD_RULES}
                        >
                            <Input.Password placeholder="Новый пароль"/>
                        </Form.Item>

                        <Form.Item
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
                            <Input.Password placeholder="Повторите новый пароль"/>
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
        </div>
    )
}
