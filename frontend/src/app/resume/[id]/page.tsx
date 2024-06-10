"use client";

import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {Divider, Flex, List} from "antd";
import styles from "../resume.module.css";
import AuthContext, {AuthContextType} from "@/context/auth";
import {COUNTRIES, DATE_FORMAT} from "@/config";
import {getUserOrLogout} from "@/utils/client_auth";
import {get_resume_id, ResumeGetType} from "@/utils/resume";
import AccessRestrict from "@/app/access-restrict";
import moment from "moment";
import "moment/locale/ru";

export default function ProfilePage({params}: { params: { id: string } }) {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    const [isUserLoading, setIsUserLoading] = useState(true);
    const [resume, setResume] = useState<ResumeGetType | null>();

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                get_resume_id(r.token, params.id).then(res => {
                    setResume(res);
                    setIsUserLoading(false);
                });
            }
        });
    }, []);

    if (isUserLoading) return <Loading/>
    if (resume) return (
        <Flex
            vertical
            align="center"
            style={{marginBottom: 80}}
        >
            <List
                className={styles.view_resume_list}
                itemLayout="horizontal"
                bordered
            >
                <Divider style={{marginBottom: 0}}>
                    <h1 style={{margin: 0}}>{resume.user_info.first_name} {resume.user_info.last_name}</h1>
                </Divider>
                <div style={{textAlign: 'center', lineHeight: 1}}>{resume.user_info.gender === 'm' ?
                    `Мужчина, ${
                        moment().diff(moment(resume.user_info.birth_date), 'years')
                    } лет, родился ${moment(resume.user_info.birth_date).format(DATE_FORMAT)}` :
                    `Женщина, ${
                        moment().diff(moment(resume.user_info.birth_date), 'years')
                    } лет, родилась ${moment(resume.user_info.birth_date).format(DATE_FORMAT)}`}</div>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Номер телефона</h2>
                        <h3>{resume.phone_number}</h3>
                    </Flex>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Способы связи</h2>
                        <p>{resume.additional_contacts}</p>
                    </Flex>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Специальность</h2>
                        <h3>{resume.profession}</h3>
                    </Flex>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Занятость</h2>
                        <h3>{resume.busyness}</h3>
                    </Flex>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Знание языков</h2>
                        <p>{resume.languages}</p>
                    </Flex>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Образование</h2>
                        <p>{resume.education}</p>
                    </Flex>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Страна</h2>
                        <h3>{COUNTRIES[resume.country]}</h3>
                    </Flex>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <Flex vertical>
                        <h2 className={styles.label}>Опыт работы</h2>
                        <p>{resume.work_experience}</p>
                    </Flex>
                </List.Item>
            </List>
        </Flex>
    )
    return <AccessRestrict/>
}
