import type {Metadata} from "next";
import {Inter} from "next/font/google";
import React from "react";
import Header from "@/components/header/header";
import {AuthProvider} from "@/context/auth";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {red} from "@ant-design/colors";
import {App, ConfigProvider} from "antd";
import ruRU from "antd/locale/ru_RU";
import "./global.css";
import dayjs from "dayjs";
import 'dayjs/locale/ru';

const inter = Inter({subsets: ["latin"]});

dayjs.locale('ru');

export const metadata: Metadata = {
    // @ts-ignore
    title: {
        default: 'WS'
    },
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="ru">
        <body className={inter.className}>
        <link rel="icon" href="/favicon.png" sizes="any"/>
        <AuthProvider>
            <AntdRegistry>
                <ConfigProvider
                    componentSize={'large'}
                    locale={ruRU}
                    theme={{
                        token: {
                            colorPrimary: red.primary,
                            fontFamily: "inherit",
                        },
                        components: {
                            Input: {
                                hoverBorderColor: '#b5b5b5',
                                activeBorderColor: '#b5b5b5',
                            },
                            Form: {
                                verticalLabelMargin: -8
                            },
                            Divider: {
                                colorSplit: '#d9d9d9',
                            }
                        }
                    }}>
                    <App
                        component={false}
                        message={{maxCount: 5}}
                        notification={{maxCount: 4}}
                    >
                        <Header/>
                        <main>
                            {children}
                        </main>
                    </App>
                </ConfigProvider>
            </AntdRegistry>
        </AuthProvider>
        </body>
        </html>
    );
}
