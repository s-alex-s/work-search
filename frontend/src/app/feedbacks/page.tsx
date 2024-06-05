"use client";

import {useContext, useEffect, useState} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";
import {useRouter} from "next/navigation";
import {App, Flex, FloatButton, List, Tabs} from "antd";
import {getUserOrLogout} from "@/utils/client_auth";
import Loading from "@/app/loading";
import InfiniteScroll from "react-infinite-scroll-component";
import CardLoader from "@/components/cardLoader";
import {FeedbackGetType, get_feedbacks, get_user_feedbacks} from "@/utils/feedback";
import FeedbackCard from "@/components/feedback-card/feedbackCard";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {MessageInstance} from "antd/es/message/interface";

function FeedbackVacancy(
    {context, router, message}:
        {
            context: AuthContextType,
            router: AppRouterInstance,
            message: MessageInstance
        }) {

    const [data, setData] = useState<FeedbackGetType[]>([]);
    const [loading, setLoading] = useState(false);

    const [nextLink, setNextLink] = useState<string | undefined>();
    const [count, setCount] = useState<number>(1);

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                loadMoreData();
            }
        });
    }, []);

    const loadMoreData = () => {
        if (loading) return;

        setLoading(true);
        getUserOrLogout(context, router).then(user => {
            if (user) {
                get_feedbacks(user.token, nextLink).then(res => {
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

    return (
        <div className="centered_content">
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
                            <FeedbackCard
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
        </div>
    );
}

function FeedbackUser(
    {context, router, message}:
        {
            context: AuthContextType,
            router: AppRouterInstance,
            message: MessageInstance
        }) {

    const [data, setData] = useState<FeedbackGetType[]>([]);
    const [loading, setLoading] = useState(false);

    const [count, setCount] = useState<number>(1);
    const [nextLink, setNextLink] = useState<string | undefined>();

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                loadMoreData();
            }
        });
    }, []);

    const loadMoreData = () => {
        if (loading) return;

        setLoading(true);
        getUserOrLogout(context, router).then(user => {
            if (user) {
                get_user_feedbacks(user.token, nextLink).then(res => {
                    if (res) {
                        res.results.forEach(value => {
                            if (!data.filter(value1 => value1.id === value.id).length) {
                                data.push(value);
                            }
                        });
                        setData([...data]);
                        setCount(res.count);
                        setNextLink(res.next);
                    }
                    setLoading(false);
                });
            }
        });
    };

    return (
        <div className="centered_content">
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
                            <FeedbackCard
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
        </div>
    );
}

export default function FeedbackPage() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const {message} = App.useApp();
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                setIsUserLoading(false);
            }
        });
    }, []);

    if (isUserLoading) return <Loading/>
    return (
        <>
            <div className="centered_content"><h1>Отклики</h1></div>

            <Flex
                justify="center"
            >
                <Tabs
                    style={{width: '80%', maxWidth: 1200, minWidth: 300}}
                    defaultActiveKey="1"
                    items={[
                        {
                            key: '1',
                            label: 'Ваши отклики',
                            children: (
                                <FeedbackUser context={context} router={router} message={message}/>
                            )
                        },
                        {
                            key: '2',
                            label: 'Отклики на ваши вакансии',
                            children: (
                                <FeedbackVacancy context={context} router={router} message={message}/>
                            )
                        }
                    ]}
                />
            </Flex>

            <FloatButton.BackTop/>
        </>
    );
}
