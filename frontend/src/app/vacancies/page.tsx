"use client";

import {useContext, useEffect, useState} from "react";
import {getUserOrLogout} from "@/utils/client_auth";
import Loading from "@/app/loading";
import AuthContext, {AuthContextType} from "@/context/auth";
import {useRouter} from "next/navigation";
import {create_vacancy, get_vacancies, VacancyFormType, VacancyType} from "@/utils/vacancy";
import InfiniteScroll from "react-infinite-scroll-component";
import {App, FloatButton, Form, Input, InputNumber, List, Modal} from "antd";
import CardLoader from "@/components/cardLoader";
import {PlusOutlined} from "@ant-design/icons";
import {CURRENCY_LENGTH, MESSAGE_DURATION, SMALL_TEXT_MAX_LENGTH, TEXT_MAX_LENGTH} from "@/config";
import {currencySelector} from "@/components/currencySelector";
import styles from './vacancies.module.css';
import VacancyCard from "@/components/vacancy-card/vacancyCard";

export default function VacanciesPage() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const {message} = App.useApp();
    const [data, setData] = useState<VacancyType[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [form] = Form.useForm<VacancyFormType>();

    const [isUserLoading, setIsUserLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const [nextLink, setNextLink] = useState<string | undefined>();
    const [count, setCount] = useState<number>(1);

    const loadMoreData = () => {
        if (loading) return;

        setLoading(true);
        getUserOrLogout(context, router).then(user => {
            if (user) {
                get_vacancies(user.token, nextLink).then(res => {
                    // @ts-ignore
                    res.results.forEach(value => {
                        if (!data.filter(value1 => value1.id === value.id).length) {
                            data.push(value);
                        }
                    });
                    setData([...data]);
                    setCount(res.count);
                    setNextLink(res.next);
                    setLoading(false);
                });
            }
        });
    };

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                setIsUserLoading(false);
                loadMoreData();
            }
        });
    }, []);

    if (isUserLoading) return <Loading/>
    return (
        <div className="centered_content">
            <h1>Ваши вакансии</h1>

            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < count}
                loader={loading ? <CardLoader/> : null}
                style={{marginBottom: 80}}
            >
                <List
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item key={item.id} style={{padding: 0, marginBottom: 20}}>
                            <VacancyCard
                                item={item}
                                data={data}
                                setData={setData}
                                context={context}
                                router={router}
                                message={message}
                            />
                        </List.Item>
                    )}
                />
            </InfiniteScroll>

            {!loading ? <FloatButton
                icon={<PlusOutlined/>}
                type="primary"
                style={{width: 50, height: 50, right: 90}}
                tooltip={<div>Создать вакансию</div>}
                onClick={() => setOpenModal(true)}
            /> : null}
            <FloatButton.BackTop/>

            <Modal
                open={openModal}
                title="Создание вакансии"
                okText="Создать"
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
                        initialValues={{
                            salary_currency: 'KZT'
                        }}
                        onFinish={async (values) => {
                            setLoadingModal(true);
                            const get_user = await getUserOrLogout(context, router);
                            if (!values.salary) delete values.salary_currency;
                            const vacancyCreate = await create_vacancy(get_user!.token, values);
                            if (vacancyCreate.status) {
                                setData([vacancyCreate.response, ...data])
                                message.success('Вакансия опубликована', MESSAGE_DURATION);
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
        </div>
    );
}
