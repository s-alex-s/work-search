import {FormInstance} from "antd";

export function getFormErrors(
    result: object, form: FormInstance, customErrors = {}) {

    const keys = Object.keys(result);
    form.setFields(Array.from(
        {length: keys.length}, (_, i) => {
            // @ts-ignore
            if (customErrors[keys[i]]) return {name: keys[i], errors: customErrors[keys[i]]}
            // @ts-ignore
            return {name: keys[i], errors: result[keys[i]]};
        }));
}
