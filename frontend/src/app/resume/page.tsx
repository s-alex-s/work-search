"use client";

import {useContext, useEffect, useState} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {change_resume, get_resume, ResumeGetType} from "@/utils/resume";
import {getUserOrLogout} from "@/utils/client_auth";
import CreateResumeForm from "@/app/resume/create_resume_form";
import {Button, Divider, Form, Input, List, Select} from "antd";
import styles from "@/app/resume/resume.module.css";
import {
    COUNTRIES_OPTIONS,
    DATE_FORMAT,
    PHONE_NUMBER_LENGTH,
    PHONE_NUMBER_RULES,
    SMALL_TEXT_MAX_LENGTH,
    TEXT_MAX_LENGTH
} from "@/config";
import {parsePhoneNumberWithError} from "libphonenumber-js";
import {countryCodeSelector} from "@/components/countryCodeSelector";
import {getFormErrors} from "@/utils/form";
import moment from "moment/moment";

type PhoneNumberFields = {
    countryCode: string,
    phone_number: string
};

type AdditionalContactsField = {
    additional_contacts: string
};

type ProfessionField = {
    profession: string
};

type BusynessField = {
    busyness: string
};

type LanguagesField = {
    languages: string
};

type EducationField = {
    education: string
};

type CountryField = {
    country: string
};

type WorkExperienceField = {
    work_experience: string
};

export default function ResumePage() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    const [isUserLoading, setIsUserLoading] = useState(true);
    const [resume, setResume] = useState<ResumeGetType | null>(null);

    const [formPhoneNumber] = Form.useForm<PhoneNumberFields>();
    const [formAdditionalContacts] = Form.useForm<AdditionalContactsField>();
    const [formProfession] = Form.useForm<ProfessionField>();
    const [formBusyness] = Form.useForm<BusynessField>();
    const [formLanguages] = Form.useForm<LanguagesField>();
    const [formEducation] = Form.useForm<EducationField>();
    const [formCountry] = Form.useForm<CountryField>();
    const [formWorkExperience] = Form.useForm<WorkExperienceField>();

    const [isPhoneNumberChangeLoading, setIsPhoneNumberChangeLoading] = useState(false);
    const [isAdditionalContactsChangeLoading, setIsAdditionalContactsChangeLoading] = useState(false);
    const [isProfessionChangeLoading, setIsProfessionChangeLoading] = useState(false);
    const [isBusynessChangeLoading, setIsBusynessChangeLoading] = useState(false);
    const [isLanguagesChangeLoading, setIsLanguagesChangeLoading] = useState(false);
    const [isEducationChangeLoading, setIsEducationChangeLoading] = useState(false);
    const [isCountryChangeLoading, setIsCountryChangeLoading] = useState(false);
    const [isWorkExperienceChangeLoading, setIsWorkExperienceChangeLoading] = useState(false);

    const [isPhoneNumberDiff, setIsPhoneNumberDiff] = useState(true);
    const [isAdditionalContactsDiff, setIsAdditionalContactsDiff] = useState(true);
    const [isProfessionDiff, setIsProfessionDiff] = useState(true);
    const [isBusynessDiff, setIsBusynessDiff] = useState(true);
    const [isLanguagesDiff, setIsLanguagesDiff] = useState(true);
    const [isEducationDiff, setIsEducationDiff] = useState(true);
    const [isCountryDiff, setIsCountryDiff] = useState(true);
    const [isWorkExperienceDiff, setIsWorkExperienceDiff] = useState(true);

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                get_resume(r.token).then((resume) => {
                    setResume(resume);
                    setIsUserLoading(false);
                });
            }
        });
    }, []);

    if (isUserLoading) return <Loading/>

    if (resume) return (
        <div className="centered_content">
            <Divider orientation='left'><h2>Резюме</h2></Divider>
            <List
                style={{marginBottom: 80}}
                itemLayout="horizontal"
                bordered
            >
                <Divider style={{marginBottom: 0}}>
                    <h2 style={{margin: 0}}>{resume.user_info.first_name} {resume.user_info.last_name}</h2>
                </Divider>
                <div style={{textAlign: 'center', lineHeight: 1, marginBottom: 20}}>{resume.user_info.gender === 'm' ?
                    `Мужчина, ${
                        moment(resume.user_info.birth_date).fromNow(true)
                    }, родился ${moment(resume.user_info.birth_date).format(DATE_FORMAT)}` :
                    `Женщина, ${
                        moment(resume.user_info.birth_date).fromNow(true)
                    }, родилась ${moment(resume.user_info.birth_date).format(DATE_FORMAT)}`}</div>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Номер телефона</h3>
                    <Form
                        layout="inline"
                        form={formPhoneNumber}
                        initialValues={{
                            countryCode: (() => {
                                try {
                                    return parsePhoneNumberWithError(resume.phone_number).countryCallingCode
                                } catch (e) {
                                    return '7';
                                }
                            })(),
                            phone_number: (() => {
                                try {
                                    return parsePhoneNumberWithError(resume.phone_number).nationalNumber
                                } catch (e) {
                                    return null;
                                }
                            })()
                        }}
                        onFinish={async (values) => {
                            setIsPhoneNumberChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            let phone_number = "";
                            if (values.phone_number) phone_number = '+' + values.countryCode + values.phone_number;
                            const result = await change_resume(
                                get_user!.token,
                                {phone_number: phone_number}
                            );
                            setIsPhoneNumberChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(
                                    result.response,
                                    formPhoneNumber,
                                    {phone_number: ['Неверный номер телефона']}
                                );
                            } else {
                                setIsPhoneNumberDiff(true);
                                setResume({
                                    ...result.response,
                                    phone_number: values.phone_number && `+${values.countryCode}${values.phone_number}`
                                } as ResumeGetType);
                            }
                        }}
                    >
                        <Form.Item<PhoneNumberFields>
                            name="phone_number"
                            rules={PHONE_NUMBER_RULES}
                        >
                            <Input
                                allowClear
                                addonBefore={countryCodeSelector}
                                onChange={(e) => {
                                    if (resume?.phone_number) {
                                        setIsPhoneNumberDiff(
                                            e.target.value === parsePhoneNumberWithError(
                                                resume?.phone_number
                                            ).nationalNumber
                                        );
                                    } else {
                                        setIsPhoneNumberDiff(e.target.value === "");
                                    }
                                }}
                                maxLength={PHONE_NUMBER_LENGTH.max}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isPhoneNumberDiff}
                                loading={isPhoneNumberChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={`${styles.listItem} ${styles.text_area_item}`}>
                    <h3 className={styles.label}>Способы связи</h3>
                    <Form
                        layout="inline"
                        form={formAdditionalContacts}
                        initialValues={{
                            additional_contacts: resume.additional_contacts
                        }}
                        onFinish={async (values) => {
                            setIsAdditionalContactsChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_resume(
                                get_user!.token,
                                {additional_contacts: values.additional_contacts}
                            );
                            setIsAdditionalContactsChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(result.response, formAdditionalContacts);
                            } else {
                                setIsAdditionalContactsDiff(true);
                                setResume({
                                    ...result.response,
                                    additional_contacts: values.additional_contacts.trim()
                                } as ResumeGetType);
                                formAdditionalContacts.setFields([{
                                    name: 'additional_contacts',
                                    value: values.additional_contacts.trim()
                                }]);
                            }
                        }}
                    >
                        <Form.Item<AdditionalContactsField>
                            name="additional_contacts"
                        >
                            <Input.TextArea
                                className={styles.text}
                                count={{
                                    max: TEXT_MAX_LENGTH,
                                    show: true
                                }}
                                maxLength={TEXT_MAX_LENGTH}
                                onChange={(e) => {
                                    setIsAdditionalContactsDiff(
                                        e.target.value.trim() === resume?.additional_contacts
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isAdditionalContactsDiff}
                                loading={isAdditionalContactsChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Специальность</h3>
                    <Form
                        layout="inline"
                        form={formProfession}
                        initialValues={{
                            profession: resume.profession
                        }}
                        onFinish={async (values) => {
                            setIsProfessionChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_resume(
                                get_user!.token,
                                {profession: values.profession}
                            );
                            setIsProfessionChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(result.response, formProfession);
                            } else {
                                setIsProfessionDiff(true);
                                setResume({
                                    ...result.response,
                                    profession: values.profession.trim()
                                } as ResumeGetType);
                                formProfession.setFields([{
                                    name: 'profession',
                                    value: values.profession.trim()
                                }]);
                            }
                        }}
                    >
                        <Form.Item<ProfessionField>
                            name="profession"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите свою специальность"
                                }
                            ]}
                        >
                            <Input
                                className={styles.text}
                                count={{
                                    max: SMALL_TEXT_MAX_LENGTH,
                                    show: true
                                }}
                                maxLength={SMALL_TEXT_MAX_LENGTH}
                                onChange={(e) => {
                                    setIsProfessionDiff(
                                        e.target.value.trim() === resume?.profession
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isProfessionDiff}
                                loading={isProfessionChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Занятость</h3>
                    <Form
                        layout="inline"
                        form={formBusyness}
                        initialValues={{
                            busyness: resume.busyness
                        }}
                        onFinish={async (values) => {
                            setIsBusynessChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_resume(
                                get_user!.token,
                                {busyness: values.busyness}
                            );
                            setIsBusynessChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(result.response, formBusyness);
                            } else {
                                setIsBusynessDiff(true);
                                setResume({
                                    ...result.response,
                                    busyness: values.busyness.trim()
                                } as ResumeGetType);
                                formBusyness.setFields([{
                                    name: 'busyness',
                                    value: values.busyness.trim()
                                }]);
                            }
                        }}
                    >
                        <Form.Item<BusynessField>
                            name="busyness"
                        >
                            <Input
                                className={styles.text}
                                count={{
                                    max: SMALL_TEXT_MAX_LENGTH,
                                    show: true
                                }}
                                maxLength={SMALL_TEXT_MAX_LENGTH}
                                onChange={(e) => {
                                    setIsBusynessDiff(
                                        e.target.value.trim() === resume?.busyness
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isBusynessDiff}
                                loading={isBusynessChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={`${styles.listItem} ${styles.text_area_item}`}>
                    <h3 className={styles.label}>Знание языков</h3>
                    <Form
                        layout="inline"
                        form={formLanguages}
                        initialValues={{
                            languages: resume.languages
                        }}
                        onFinish={async (values) => {
                            setIsLanguagesChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_resume(
                                get_user!.token,
                                {languages: values.languages}
                            );
                            setIsLanguagesChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(result.response, formLanguages);
                            } else {
                                setIsLanguagesDiff(true);
                                setResume({
                                    ...result.response,
                                    languages: values.languages.trim()
                                } as ResumeGetType);
                                formLanguages.setFields([{
                                    name: 'languages',
                                    value: values.languages.trim()
                                }]);
                            }
                        }}
                    >
                        <Form.Item<LanguagesField>
                            name="languages"
                        >
                            <Input.TextArea
                                className={styles.text}
                                count={{
                                    max: TEXT_MAX_LENGTH,
                                    show: true
                                }}
                                maxLength={TEXT_MAX_LENGTH}
                                onChange={(e) => {
                                    setIsLanguagesDiff(
                                        e.target.value.trim() === resume?.languages
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isLanguagesDiff}
                                loading={isLanguagesChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={`${styles.listItem} ${styles.text_area_item}`}>
                    <h3 className={styles.label}>Образование</h3>
                    <Form
                        layout="inline"
                        form={formEducation}
                        initialValues={{
                            education: resume.education
                        }}
                        onFinish={async (values) => {
                            setIsEducationChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_resume(
                                get_user!.token,
                                {education: values.education}
                            );
                            setIsEducationChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(result.response, formEducation);
                            } else {
                                setIsEducationDiff(true);
                                setResume({
                                    ...result.response,
                                    education: values.education.trim()
                                } as ResumeGetType);
                                formEducation.setFields([{
                                    name: 'education',
                                    value: values.education.trim()
                                }]);
                            }
                        }}
                    >
                        <Form.Item<EducationField>
                            name="education"
                        >
                            <Input.TextArea
                                className={styles.text}
                                count={{
                                    max: TEXT_MAX_LENGTH,
                                    show: true
                                }}
                                maxLength={TEXT_MAX_LENGTH}
                                onChange={(e) => {
                                    setIsEducationDiff(
                                        e.target.value.trim() === resume?.education
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isEducationDiff}
                                loading={isEducationChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={styles.listItem}>
                    <h3 className={styles.label}>Страна</h3>
                    <Form
                        layout="inline"
                        form={formCountry}
                        initialValues={{
                            country: !resume.country ? null : resume.country
                        }}
                        onFinish={async (values) => {
                            setIsCountryChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_resume(
                                get_user!.token,
                                {country: values.country ?? ""}
                            );
                            setIsCountryChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(result.response, formCountry);
                            } else {
                                setIsCountryDiff(true);
                                setResume({
                                    ...result.response,
                                    country: values.country
                                } as ResumeGetType);
                                formCountry.setFields([{
                                    name: 'country',
                                    value: values.country
                                }]);
                            }
                        }}
                    >
                        <Form.Item<CountryField>
                            name="country"
                        >
                            <Select
                                className={styles.text}
                                showSearch
                                placeholder="Выберите страну"
                                allowClear
                                options={COUNTRIES_OPTIONS}
                                optionFilterProp="label"
                                onChange={(e) => {
                                    setIsCountryDiff(
                                        e === resume.country
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isCountryDiff}
                                loading={isCountryChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>

                <List.Item className={`${styles.listItem} ${styles.text_area_item}`}>
                    <h3 className={styles.label}>Опыт работы</h3>
                    <Form
                        layout="inline"
                        form={formWorkExperience}
                        initialValues={{
                            work_experience: resume.work_experience
                        }}
                        onFinish={async (values) => {
                            setIsWorkExperienceChangeLoading(true);
                            const get_user = await getUserOrLogout(context, router);
                            const result = await change_resume(
                                get_user!.token,
                                {work_experience: values.work_experience}
                            );
                            setIsWorkExperienceChangeLoading(false);
                            if (!result.status) {
                                getFormErrors(result.response, formWorkExperience);
                            } else {
                                setIsWorkExperienceDiff(true);
                                setResume({
                                    ...result.response,
                                    work_experience: values.work_experience.trim()
                                } as ResumeGetType);
                                formWorkExperience.setFields([{
                                    name: 'work_experience',
                                    value: values.work_experience.trim()
                                }]);
                            }
                        }}
                    >
                        <Form.Item<WorkExperienceField>
                            name="work_experience"
                        >
                            <Input.TextArea
                                className={styles.text}
                                count={{
                                    max: TEXT_MAX_LENGTH,
                                    show: true
                                }}
                                maxLength={TEXT_MAX_LENGTH}
                                onChange={(e) => {
                                    setIsWorkExperienceDiff(
                                        e.target.value.trim() === resume?.work_experience
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isWorkExperienceDiff}
                                loading={isWorkExperienceChangeLoading}
                            >
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </List.Item>
            </List>
        </div>
    )

    return <CreateResumeForm context={context} router={router} setResume={setResume}/>
}
