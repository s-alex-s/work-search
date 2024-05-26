"use client";

import {Button, Result} from "antd";
import Link from "next/link";

export default function AccessRestrict() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="У вас нет доступа к этой странице"
            extra={<Link href="/"><Button type="primary">На главную</Button></Link>}
        />
    )
}
