import styles from "@/app/resume/resume.module.css";
import {getUserOrLogout} from "@/utils/client_auth";
import {create_resume, ResumeFormType, ResumeGetType} from "@/utils/resume";
import {
    COUNTRIES_OPTIONS,
    MESSAGE_DURATION,
    PHONE_NUMBER_LENGTH,
    PHONE_NUMBER_RULES,
    SMALL_TEXT_MAX_LENGTH,
    TEXT_MAX_LENGTH
} from "@/config";
import {App, Button, Form, Input, Select} from "antd";
import {countryCodeSelector} from "@/components/countryCodeSelector";
import {Dispatch, SetStateAction, useState} from "react";
import {AuthContextType} from "@/context/auth";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {getFormErrors} from "@/utils/form";

export default function CreateResumeForm(
    {
        context,
        router,
        setResume
    }: {
        context: AuthContextType,
        router: AppRouterInstance,
        setResume: Dispatch<SetStateAction<ResumeGetType | null>>
    }) {

    const {message} = App.useApp();

    const [form] = Form.useForm<ResumeFormType>();
    const [buttonLoading, setButtonLoading] = useState(false);

    return (
        <Form
            layout="vertical"
            form={form}
            className={`${styles.create_resume_form} central-form`}
            initialValues={{
                countryCode: '7'
            }}
            onFinish={async (values) => {
                setButtonLoading(true);
                const get_user = await getUserOrLogout(context, router);
                let phone_number = "";
                if (values.phone_number) phone_number = '+' + values.countryCode + values.phone_number;
                values.phone_number = phone_number;
                const resumeCreate = await create_resume(get_user!.token, values);
                if (resumeCreate.status) {
                    setResume(resumeCreate.response);
                    message.success('Резюме создано', MESSAGE_DURATION);
                } else {
                    getFormErrors(resumeCreate.response, form, {phone_number: ['Неверный номер телефона']});
                }
                setButtonLoading(false);
            }}
        >
            <h1 style={{marginTop: 0}}>Создайте резюме</h1>

            <Form.Item<ResumeFormType>
                name="phone_number"
                label="Номер телефона"
                rules={PHONE_NUMBER_RULES}
            >
                <Input addonBefore={countryCodeSelector} maxLength={PHONE_NUMBER_LENGTH.max}/>
            </Form.Item>

            <Form.Item<ResumeFormType>
                name="additional_contacts"
                label="Другие способы связи"
            >
                <Input.TextArea
                    count={{
                        max: TEXT_MAX_LENGTH,
                        show: true
                    }}
                    maxLength={TEXT_MAX_LENGTH}
                />
            </Form.Item>

            <Form.Item<ResumeFormType>
                name="profession"
                label="Специальность"
                rules={[
                    {
                        required: true,
                        message: "Введите свою специальность"
                    }
                ]}
            >
                <Input
                    count={{
                        max: SMALL_TEXT_MAX_LENGTH,
                        show: true
                    }}
                    maxLength={SMALL_TEXT_MAX_LENGTH}
                />
            </Form.Item>

            <Form.Item<ResumeFormType>
                name="busyness"
                label="Занятость"
            >
                <Input
                    count={{
                        max: SMALL_TEXT_MAX_LENGTH,
                        show: true
                    }}
                    maxLength={SMALL_TEXT_MAX_LENGTH}
                />
            </Form.Item>

            <Form.Item<ResumeFormType>
                name="languages"
                label="Знание языков"
            >
                <Input.TextArea
                    count={{
                        max: TEXT_MAX_LENGTH,
                        show: true
                    }}
                    maxLength={TEXT_MAX_LENGTH}
                />
            </Form.Item>

            <Form.Item<ResumeFormType>
                name="education"
                label="Образование"
            >
                <Input
                    count={{
                        max: SMALL_TEXT_MAX_LENGTH,
                        show: true
                    }}
                    maxLength={SMALL_TEXT_MAX_LENGTH}
                />
            </Form.Item>

            <Form.Item<ResumeFormType>
                name="country"
                label="Страна"
            >
                <Select
                    showSearch
                    placeholder="Выберите страну"
                    allowClear
                    options={COUNTRIES_OPTIONS}
                    optionFilterProp="label"
                />
            </Form.Item>

            <Form.Item<ResumeFormType>
                name="work_experience"
                label="Опыт работы"
            >
                <Input.TextArea
                    count={{
                        max: TEXT_MAX_LENGTH,
                        show: true
                    }}
                    maxLength={TEXT_MAX_LENGTH}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    loading={buttonLoading}
                    style={{width: '100%'}}
                    type="primary"
                    htmlType="submit"
                >
                    Создать
                </Button>
            </Form.Item>
        </Form>
    )
}