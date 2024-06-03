import {Form, Select} from "antd";
import {getCountries, getCountryCallingCode} from "libphonenumber-js";
import {DefaultOptionType} from "rc-select/es/Select";

const phone_codes: DefaultOptionType[] = [];
getCountries().forEach(country => {
    const countryCallingCode = getCountryCallingCode(country);
    if (phone_codes.every(value => value.value !== countryCallingCode)) {
        phone_codes.push({
            value: countryCallingCode,
            label: `+${countryCallingCode}`,
        });
    }
});

export const countryCodeSelector = (
    <Form.Item
        name="countryCode"
        noStyle
    >
        <Select
            showSearch
            style={{width: 85}}
            options={phone_codes}
            optionFilterProp="label"
        />
    </Form.Item>
)
