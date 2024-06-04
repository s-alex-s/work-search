import {Card, Skeleton} from "antd";

export default function CardLoader() {
    return (
        <Card>
            <Skeleton active paragraph={{rows: 5}}/>
        </Card>
    )
}
