import moment from "moment/moment";
import {Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Space} from "antd";
import {change_vacancy, delete_vacancy, VacancyFormType, VacancyType} from "@/utils/vacancy";
import styles from './vacancy-card.module.css';
import {
    COUNTRIES,
    COUNTRIES_OPTIONS,
    CURRENCY_LENGTH,
    DATE_FORMAT,
    display_salary,
    MESSAGE_DURATION,
    SMALL_TEXT_MAX_LENGTH,
    TEXT_MAX_LENGTH,
    VACANCY_TITLE_LENGTH
} from "@/config";
import {Dispatch, SetStateAction, useState} from "react";
import {getUserOrLogout} from "@/utils/client_auth";
import {AuthContextType} from "@/context/auth";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {MessageInstance} from "antd/es/message/interface";
import {currencySelector} from "@/components/currencySelector";
import {create_feedback} from "@/utils/feedback";
import {red} from "@ant-design/colors";
import Link from "next/link";
import "moment/locale/ru";

export function VacancyDataCard(
    {item, context, router, message, linkOff = false}: {
        item: VacancyType,
        context: AuthContextType,
        router: AppRouterInstance,
        message: MessageInstance,
        linkOff?: boolean
    }) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    return (
        <>
            <Card
                className={styles.card}
                title={
                    linkOff ? <h2 className={styles.title}>{item.title}</h2> :
                        <Link href={`/vacancies/${item.id}/`} className={styles.link} style={{color: red.primary}}>
                            <h2>{item.title}</h2>
                        </Link>}
                extra={moment(item.created_at).format(`Опубликовано в HH:mm, ${DATE_FORMAT}`)}
            >
                {item.salary ? <><h3>Зарплата</h3><p>{display_salary(item)}</p></> : 'Уровень дохода не указан'}
                {item.company ? <><h3>Организация</h3><p>{item.company}</p></> : null}
                {item.country ? <><h3>Страна</h3><p>{COUNTRIES[item.country]}</p></> : null}

                {context.user?.id !== item.user_id ? <Button
                    style={{float: 'right'}}
                    type="primary"
                    disabled={item.feedback || !item.has_resume}
                    loading={buttonLoading}
                    onClick={async () => {
                        setButtonLoading(true);
                        const get_user = await getUserOrLogout(context, router);
                        const feedbackCreate = await create_feedback(
                            get_user!.token,
                            {
                                vacancy: item.id
                            }
                        );
                        setButtonLoading(false);
                        if (feedbackCreate.status) {
                            item.feedback = true;
                            message.success('Отклик отправлен', MESSAGE_DURATION);
                        } else {
                            message.error('Ошибка', MESSAGE_DURATION);
                        }
                    }}
                >
                    {item.feedback ? 'Отклик отправлен' : !item.has_resume ? 'У вас нет резюме' : 'Откликнуться'}
                </Button> : null}
            </Card>
        </>
    )
}

export default function VacancyCard(
    {item, data, setData, context, router, message}: {
        item: VacancyType,
        data: VacancyType[],
        setData: Dispatch<SetStateAction<VacancyType[]>>,
        context: AuthContextType,
        router: AppRouterInstance,
        message: MessageInstance
    }) {

    const [openModal, setOpenModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [form] = Form.useForm<VacancyFormType>();

    return (
        <>
            <Card
                className={styles.card}
                title={<h2 className={styles.title}>{item.title}</h2>}
                extra={moment(item.created_at).format(`Опубликовано в HH:mm, ${DATE_FORMAT}`)}
            >
                {item.salary ? <><h3>Зарплата</h3><p>{display_salary(item)}</p></> : 'Уровень дохода не указан'}
                {item.company ? <><h3>Организация</h3><p>{item.company}</p></> : null}
                {item.country ? <><h3>Страна</h3><p>{COUNTRIES[item.country]}</p></> : null}
                {item.requirements ? <><h3>Требования</h3><p>{item.requirements}</p></> : null}
                {item.description ? <><h3>Описание</h3><p>{item.description}</p></> : null}
                <Space>
                    <Popconfirm
                        title="Удалить вакансию"
                        description="Вы действительно хотите удалить вакансию?"
                        cancelText="Отмена"
                        okText="Да"
                        onConfirm={async () => {
                            const get_user = await getUserOrLogout(context, router);
                            const deleteVacancy = await delete_vacancy(get_user!.token, item.id);
                            if (deleteVacancy) {
                                message.success("Вакансия удалена", MESSAGE_DURATION);
                                setData(data.filter(value => value.id !== item.id));
                            } else {
                                message.error('Ошибка');
                            }
                        }}
                    >
                        <Button type="primary">Удалить</Button>
                    </Popconfirm>

                    <Button
                        onClick={() => setOpenModal(true)}
                    >
                        Редактировать
                    </Button>
                </Space>
            </Card>

            <Modal
                open={openModal}
                title="Вакансия"
                okText="Сохранить"
                confirmLoading={loadingModal}
                cancelText="Отмена"
                okButtonProps={{autoFocus: true, htmlType: 'submit'}}
                onCancel={() => {
                    form.resetFields();
                    setOpenModal(false);
                }}
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        initialValues={item}
                        onFinish={async (values) => {
                            setLoadingModal(true);
                            const get_user = await getUserOrLogout(context, router);
                            if (!values.salary) delete values.salary_currency;
                            const vacancyChange = await change_vacancy(
                                get_user!.token, {...values, id: item.id}
                            );
                            if (vacancyChange.status) {
                                data = data.map(value => value.id === item.id ? vacancyChange.response : value);
                                setData([...data]);
                                message.success('Вакансия изменена', MESSAGE_DURATION);
                            }
                            setLoadingModal(false);
                            setOpenModal(false);
                        }}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item<VacancyFormType>
                    name="title"
                    label="Название"
                    rules={[
                        {
                            required: true,
                            message: 'Введите название вакансии'
                        },
                        {
                            max: VACANCY_TITLE_LENGTH,
                            message: `Длина названия вакансии не должна превышать ${VACANCY_TITLE_LENGTH} символов`
                        }
                    ]}
                >
                    <Input
                        className={styles.form_item}
                        maxLength={VACANCY_TITLE_LENGTH}
                        count={{
                            show: true,
                            max: VACANCY_TITLE_LENGTH
                        }}
                    />
                </Form.Item>

                <Form.Item<VacancyFormType>
                    name="salary"
                    label="Зарплата"
                >
                    <InputNumber
                        addonAfter={currencySelector}
                        maxLength={CURRENCY_LENGTH}
                        className={styles.form_item}
                    />
                </Form.Item>

                <Form.Item<VacancyFormType>
                    name="company"
                    label="Организация"
                    rules={[{
                        required: true,
                        message: 'Введите название организации'
                    }]}
                >
                    <Input
                        className={styles.form_item}
                        maxLength={SMALL_TEXT_MAX_LENGTH}
                        count={{
                            show: true,
                            max: SMALL_TEXT_MAX_LENGTH
                        }}
                    />
                </Form.Item>

                <Form.Item<VacancyFormType>
                    name="country"
                    label="Страна"
                    rules={[{
                        required: true,
                        message: 'Укажите страну'
                    }]}
                >
                    <Select
                        showSearch
                        placeholder="Выберите страну"
                        allowClear
                        options={COUNTRIES_OPTIONS}
                        optionFilterProp="label"
                    />
                </Form.Item>

                <Form.Item<VacancyFormType>
                    name="requirements"
                    label="Требования"
                >
                    <Input.TextArea
                        className={styles.form_item}
                        maxLength={TEXT_MAX_LENGTH}
                        count={{
                            show: true,
                            max: TEXT_MAX_LENGTH
                        }}
                    />
                </Form.Item>

                <Form.Item<VacancyFormType>
                    name="description"
                    label="Описание"
                >
                    <Input.TextArea
                        className={styles.form_item}
                        maxLength={TEXT_MAX_LENGTH}
                        count={{
                            show: true,
                            max: TEXT_MAX_LENGTH
                        }}
                    />
                </Form.Item>
            </Modal>
        </>
    )
}
