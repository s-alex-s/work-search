"use client";

import {useContext, useEffect, useState} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {getUserOrLogout} from "@/utils/client_auth";
import {search_vacancies, VacancyType} from "@/utils/vacancy";
import InfiniteScroll from "react-infinite-scroll-component";
import CardLoader from "@/components/cardLoader";
import {App, FloatButton, List} from "antd";
import {VacancyDataCard} from "@/components/vacancy-card/vacancyCard";
import Search from "antd/es/input/Search";
import styles from "./search.module.css";

export default function HomePage() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const {message} = App.useApp();
    const [data, setData] = useState<VacancyType[]>([]);

    const [loading, setLoading] = useState(false);

    const [nextLink, setNextLink] = useState<string | undefined>();
    const [count, setCount] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>();

    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                setIsUserLoading(false);
            }
        });
    }, []);

    const loadMoreData = () => {
        if (loading) return;

        setLoading(true);
        getUserOrLogout(context, router).then(user => {
            if (user && search) {
                search_vacancies(search, user.token, nextLink).then(res => {
                    if (res) {
                        res.results.forEach(value => {
                            if (!data.filter(value1 => value1.id === value.id).length) {
                                data.push(value);
                            }
                        });
                        setData([...data]);
                        setCount(res.count);
                        setNextLink(res.next);
                        setLoading(false);
                    } else {
                        message.info('Создайте резюме');
                        router.push('/resume');
                    }
                });
            }
            setLoading(false);
        });
    };

    if (isUserLoading) return <Loading/>
    return (
        <>
            <div className="centered_content"><h1>Поиск вакансий</h1></div>
            <div className="centered_content">
                <Search
                    className={styles.search}
                    loading={loading}
                    placeholder="Название вакансии"
                    allowClear
                    enterButton="Поиск"
                    onSearch={async (value, event, info) => {
                        if (info?.source === 'input') {
                            let data_local = data;
                            setSearch(value);
                            data_local = [];
                            if (value.trim()) {
                                setLoading(true);
                                const user = await getUserOrLogout(context, router);
                                if (user && value) {
                                    const res = await search_vacancies(value, user.token, nextLink);
                                    if (res) {
                                        res.results.forEach(value => {
                                            if (!data_local.filter(value1 => value1.id === value.id).length) {
                                                data_local.push(value);
                                            }
                                        });
                                        setData([...data_local]);
                                        setCount(res.count);
                                        setNextLink(res.next);
                                    } else {
                                        message.info('Создайте резюме');
                                        router.push('/resume');
                                    }
                                }
                                setLoading(false);
                            }
                        }
                    }}
                />
            </div>
            <div className="centered_content">
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < count}
                    loader={loading ? <CardLoader/> : null}
                    style={{marginBottom: 80, marginTop: 40}}
                >
                    {search ? <List
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item key={item.id} style={{padding: 0, marginBottom: 20}}>
                                <VacancyDataCard
                                    item={item}
                                    context={context}
                                    router={router}
                                    message={message}
                                />
                            </List.Item>
                        )}
                    /> : null}
                </InfiniteScroll>

                <FloatButton.BackTop/>
            </div>
        </>
    );
}
