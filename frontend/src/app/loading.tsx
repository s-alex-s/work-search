import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";

export default function Loading() {
    return <Spin indicator={<LoadingOutlined spin style={{fontSize: 112}}/>} fullscreen/>
}