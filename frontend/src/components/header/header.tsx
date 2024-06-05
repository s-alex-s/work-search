"use client";

import Link from "next/link";
import {Dropdown, Flex, MenuProps, Spin} from "antd";
import React, {useContext} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";
import {LoadingOutlined} from "@ant-design/icons";
import {usePathname, useRouter} from "next/navigation";
import {NO_HEADER_PAGES} from "@/config";
import styles from "./header.module.css";
import {logoutUser} from "@/utils/client_auth";


export default function Header() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const items: MenuProps['items'] = [
        {
            label: <Link href='/profile'>Профиль</Link>,
            key: 'profile'
        },
        {
            label: <div style={{color: '#f5222d'}} onClick={() => logoutUser(context, router)}>Выйти</div>,
            key: 'logout'
        }
    ];

    if (!NO_HEADER_PAGES.test(usePathname())) return (
        <header className={styles.header}>
            <Flex align="center" className={styles.header_flex}>
                <Link href={context.user ? '/' : ''}>
                    <svg
                        width="50"
                        height="50"
                        xmlns="http://www.w3.org/2000/svg">

                        <circle
                            cx="25" cy="25"
                            r="25"
                            fill="#f5222d"/>
                        <text
                            x="25"
                            y="27"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="22"
                            fontWeight="500"
                            fill="white">
                            WS
                        </text>
                    </svg>
                </Link>

                <Link href='/resume' className={styles.navElement}>{context.user ? 'Моё резюме' : null}</Link>
                <Link href='/vacancies' className={styles.navElement}>{context.user ? 'Мои вакансии' : null}</Link>
                <Link href='/feedbacks' className={styles.navElement}>{context.user ? 'Отклики' : null}</Link>

                <div className={styles.margin_left}/>

                {!context.loading ?
                    context.user ?
                        <Dropdown
                            menu={{items}}
                            trigger={['hover']}
                            overlayStyle={{paddingTop: '15px'}}
                        >
                            <a
                                onClick={(e) => e.preventDefault()}
                            >
                                {context.user.first_name} {context.user.last_name}
                            </a>
                        </Dropdown> : null :
                    <Spin indicator={<LoadingOutlined spin style={{fontSize: 32}}/>}/>}
            </Flex>
        </header>
    )
    return null;
}
