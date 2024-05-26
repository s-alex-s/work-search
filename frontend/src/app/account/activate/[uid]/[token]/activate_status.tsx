"use client";

import {Button, Result} from "antd";
import Link from "next/link";

export function Success() {
    return (
        <Result
            status="success"
            title="Аккаунт активирован"
            subTitle={'Ваш аккаунт был успешно активирован'}
            extra={[
                <Link key="to_login" href="/login">
                    <Button>Перейти на страницу авторизации</Button>
                </Link>
            ]}
        />
    )
}

export function Error() {
    return <Result
        status="error"
        title="Ошибка активации"
        subTitle="При активации аккаунта произошла ошибка"
        extra={[
            <Link key="to_login" href="/login">
                <Button>Перейти на страницу авторизации</Button>
            </Link>
        ]}
    />
}
