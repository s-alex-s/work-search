"use client";

import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {Divider, Flex, List} from "antd";
import styles from "../resume.module.css";
import AuthContext, {AuthContextType} from "@/context/auth";
import {COUNTRIES} from "@/config";
import {getUserOrLogout} from "@/utils/client_auth";
import {get_resume_id, ResumeGetType} from "@/utils/resume";
import NotFound from "@/app/not-found";

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
                <Divider><h1>{resume.username}</h1></Divider>

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
    return <NotFound/>
}
