import moment from "moment/moment";
import {Button, Card, Flex, Popconfirm, Space} from "antd";
import {DATE_FORMAT, MESSAGE_DURATION} from "@/config";
import {Dispatch, SetStateAction} from "react";
import {getUserOrLogout} from "@/utils/client_auth";
import {AuthContextType} from "@/context/auth";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {MessageInstance} from "antd/es/message/interface";
import {delete_feedback, FeedbackGetType} from "@/utils/feedback";
import Link from "next/link";
import {red} from "@ant-design/colors";
import styles from "@/components/vacancy-card/vacancy-card.module.css";

export default function FeedbackCard(
    {item, data, setData, context, router, message}: {
        item: FeedbackGetType,
        data: FeedbackGetType[],
        setData: Dispatch<SetStateAction<FeedbackGetType[]>>,
        context: AuthContextType,
        router: AppRouterInstance,
        message: MessageInstance
    }) {

    return (
        <>
            <Card
                title={item.vacancy.title ?
                    <Link href={`/vacancies/${item.vacancy.id}/`} style={{color: red.primary}} className={styles.link}>
                        <h3>{item.vacancy.title}</h3>
                    </Link> : null}
            >
                <Flex
                    justify="space-between"
                    align="center"
                >
                    {item.resume?.name ?
                        <Link
                            href={`/resume/${item.resume.id}/`}
                            style={{color: red.primary}}
                            className={styles.link}
                        >
                            <h3>{item.resume.name}</h3>
                        </Link> : null}
                    <h4>{moment(item.created_at).format(`HH:mm, ${DATE_FORMAT}`)}</h4>
                    <Space>
                        <Popconfirm
                            title="Удалить отклик"
                            description="Вы действительно хотите удалить отклик?"
                            cancelText="Отмена"
                            okText="Да"
                            onConfirm={async () => {
                                const get_user = await getUserOrLogout(context, router);
                                const deleteVacancy = await delete_feedback(get_user!.token, item.id);
                                if (deleteVacancy) {
                                    message.success("Отклик удалён", MESSAGE_DURATION);
                                    setData(data.filter(value => value.id !== item.id));
                                } else {
                                    message.error('Ошибка');
                                }
                            }}
                        >
                            <Button type="primary">Удалить</Button>
                        </Popconfirm>
                    </Space>
                </Flex>
            </Card>
        </>
    )
}
