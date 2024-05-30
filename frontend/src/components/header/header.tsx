"use client";

import Link from "next/link";
import {Button, Dropdown, Flex, MenuProps, Spin} from "antd";
import React, {useContext} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";
import {LoadingOutlined} from "@ant-design/icons";
import {usePathname, useRouter} from "next/navigation";
import {NO_HEADER_PAGES} from "@/config";
import styles from "./header.module.css";
import {logoutUser} from "@/utils/auth";


export default function Header() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const items: MenuProps['items'] = [
        {
            label: <Link href='/profile'>Профиль</Link>,
            key: 'profile'
        },
        {
            label: <div style={{color: '#f5222d'}} onClick={() => {
                logoutUser().then(() => {
                    context.setUser(null);
                    router.push('/login');
                });
            }}>Выйти</div>,
            key: 'logout'
        }
    ];

    if (!NO_HEADER_PAGES.test(usePathname())) return (
        <header className={styles.header}>
            <Flex align="center" style={{maxWidth: '1200px', margin: '0 auto'}}>
                <Link href='/'>
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

                <Link href='' className={styles.navElement}>Моё резюме</Link>
                <Link href='' className={styles.navElement}>Мои вакансии</Link>
                <Link href='' className={styles.navElement}>Отклики</Link>

                <div style={{marginLeft: 'auto'}}/>

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
                        </Dropdown> :
                        <Link href="/login"><Button type="primary">Войти</Button></Link> :
                    <Spin indicator={<LoadingOutlined spin style={{fontSize: 32}}/>}/>}
            </Flex>
        </header>
    )
    return null;
}
