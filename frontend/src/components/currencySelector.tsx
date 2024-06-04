import {Form, Select} from "antd";
import {CURRENCIES} from "@/config";

export const currencySelector = (
    <Form.Item
        name="salary_currency"
        noStyle
    >
        <Select
            style={{width: 85}}
            options={CURRENCIES}
        />
    </Form.Item>
)
