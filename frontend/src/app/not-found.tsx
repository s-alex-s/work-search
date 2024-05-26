import {Button, Result} from "antd";
import Link from "next/link";

export default function NotFound() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Такой страницы не существует"
            extra={<Link href="/"><Button type="primary">На главную</Button></Link>}
        />
    )
}
