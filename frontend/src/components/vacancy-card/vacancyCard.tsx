import moment from "moment/moment";
import {Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Space} from "antd";
import {change_vacancy, delete_vacancy, VacancyFormType, VacancyType} from "@/utils/vacancy";
import styles from './vacancy_card.module.css';
import {
    COUNTRIES,
    COUNTRIES_OPTIONS,
    CURRENCIES,
    CURRENCY_LENGTH,
    MESSAGE_DURATION,
    SMALL_TEXT_MAX_LENGTH,
    TEXT_MAX_LENGTH
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

export function VacancyDataCard(
    {item, context, router, message}: {
        item: VacancyType,
        context: AuthContextType,
        router: AppRouterInstance,
        message: MessageInstance
    }) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    return (
        <>
            <Card
                className={styles.card}
                title={
                    <Link href={`/vacancies/${item.id}/`} className={styles.link}>
                        <h2 style={{color: red.primary}}>{item.title}</h2>
                    </Link>}
                extra={moment(item.created_at).format("Опубликовано: HH:mm DD.MM.YYYY")}
            >
                {item.salary ? <><h3>Зарплата</h3><p>
                    {item.salary}{CURRENCIES.filter(
                    value => value.value === item.salary_currency)[0].label}
                </p></> : 'Уровень дохода не указан'}
                {item.company ? <><h3>Организация</h3><p>{item.company}</p></> : null}
                {item.country ? <><h3>Страна</h3><p>{COUNTRIES[item.country]}</p></> : null}

                <Button
                    style={{float: 'right'}}
                    type="primary"
                    disabled={item.feedback}
                    loading={buttonLoading}
                    onClick={async () => {
                        setButtonLoading(true);
                        const get_user = await getUserOrLogout(context, router);
                        const feedbackCreate = await create_feedback(
                            get_user!.token,
                            {
                                resume: get_user!.id,
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
                    {item.feedback ? 'Отклик отправлен' : 'Откликнуться'}
                </Button>
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
                title={<h2 style={{margin: 0}}>{item.title}</h2>}
                extra={moment(item.created_at).format("Опубликовано: HH:mm DD.MM.YYYY")}
            >
                {item.salary ? <><h3>Зарплата</h3><p>
                    {item.salary}{CURRENCIES.filter(
                    value => value.value === item.salary_currency)[0].label}
                </p></> : 'Уровень дохода не указан'}
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
                title="Создание вакансии"
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
                                setData([...data])
                                message.success('Вакансия изменена', MESSAGE_DURATION);
                            }
                            setLoadingModal(false);
                            form.resetFields();
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
                    rules={[{
                        required: true,
                        message: 'Введите название вакансии'
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
