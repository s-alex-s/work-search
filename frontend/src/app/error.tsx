"use client";

import {Button, Result} from "antd";
import Link from "next/link";

export default function Error({error, reset}: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <Result
            status="500"
            title="500"
            subTitle="Что-то пошло не так"
            extra={<Link href="/"><Button type="primary">На главную</Button></Link>}
        />
    )
}
