"use client";

import Link from "next/link";
import {Button, Flex, Spin} from "antd";
import React, {useContext} from "react";
import {logoutUser} from "@/utils/auth";
import AuthContext, {AuthContextType} from "@/context/auth";
import {LoadingOutlined} from "@ant-design/icons";
import {usePathname} from "next/navigation";
import {NO_HEADER_PAGES} from "@/config";
import styles from "./header.module.css";


export default function Header() {
    const context = useContext(AuthContext) as AuthContextType;

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
                <div style={{marginLeft: 'auto'}}/>
                {!context.loading ?
                    context.user ?
                        <Button onClick={() => {
                            logoutUser().then();
                            context.update();
                        }} type="primary">Выйти</Button> :
                        <Link href="/login"><Button type="primary">Войти</Button></Link> :
                    <Spin indicator={<LoadingOutlined spin style={{fontSize: 32}}/>}/>}
            </Flex>
        </header>
    )
    return null;
}
