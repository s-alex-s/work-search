"use client";

import {useContext, useEffect, useState} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";
import {useRouter} from "next/navigation";
import {App, FloatButton} from "antd";
import {getUserOrLogout} from "@/utils/client_auth";
import Loading from "@/app/loading";
import {VacancyDataCard} from "@/components/vacancy-card/vacancyCard";
import {get_vacancy, VacancyType} from "@/utils/vacancy";

export default function VacancyViewPage({params}: { params: { id: string } }) {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const {message} = App.useApp();
    const [item, setItem] = useState<VacancyType>();

    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                get_vacancy(r.token, params.id).then(res => {
                    setItem(res)
                    setIsUserLoading(false);
                });
            }
        });
    }, []);

    if (isUserLoading) return <Loading/>
    return (
        <div className="centered_content" style={{paddingBottom: 80}}>
            <VacancyDataCard
                linkOff={true}
                item={item!}
                context={context}
                router={router}
                message={message}
            />

            {item!.requirements ? <><h2>Требования</h2>
                <p style={{whiteSpace: 'pre-wrap'}}>{item!.requirements}</p></> : null}

            {item!.description ? <><h2>Описание</h2>
                <p style={{whiteSpace: 'pre-wrap'}}>{item!.description}</p></> : null}

            <FloatButton.BackTop/>
        </div>
    );
}
