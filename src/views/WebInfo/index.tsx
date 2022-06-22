import React, {FC, useEffect, useCallback} from 'react';
import {Card, Form, Input, Button, message} from 'antd';
import {WebInfoApi} from '@/api';
import { connect } from 'react-redux';
import { toggleGlobalLoading } from '@/redux/reducers/common/actions';

interface IProps {
    setGlobalLoading: (globalLoading: GIGlobalLoading) => void;
}

interface Avatar {
    url: string;
    key: string;
}

interface WebInfoForm {
    webUser: string;
    githubLink: string;
    avatar: Avatar;
    webBanner: Array<GIFileInfo>;
    motto: string;
    personalDesc: string;
    webDesc: string;
}

const WebInfo: FC<IProps> = ({setGlobalLoading}) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;

    useEffect(() => {
        setGlobalLoading({
            isLoading: true,
            loadingTips: '加载中...'
        });
        WebInfoApi.getWebInfo().then(res => {
            const {paramData} = res.data;
            form.setFieldsValue({
                webUser: paramData.WEB_USER || '',
                githubLink: paramData.GITHUB_LINK || '',
                personalDesc: paramData.PERSONAL_DESC || '',
                webDesc: paramData.WEB_DESC || '',
                motto: paramData.MOTTO || ''
            });
        }).finally(() => {
            setGlobalLoading({
                isLoading: false
            });
        });
    });

    const onFinish = useCallback((values: WebInfoForm) => {
        console.log(values);
        setGlobalLoading({
            isLoading: true,
            loadingTips: '保存中...'
        });

        const webBanner =
            values.webBanner && values.webBanner.length > 0 ?
                values.webBanner[0].key :
                '';

        const paramObj = {
            WEB_USER: values.webUser,
            GITHUB_LINK: values.githubLink,
            WEB_AVATAR: values.avatar ? values.avatar.key : '',
            PERSONAL_DESC: values.personalDesc,
            WEB_DESC: values.webDesc,
            MOTTO: values.motto,
            WEB_BANNER: webBanner
        };

        WebInfoApi.saveWebInfo({ paramObj })
            .then(() => {
                message.success('保存成功').then();
            })
            .catch(() => {
                message.error('保存失败').then();
            })
            .finally(() => {
                setGlobalLoading({
                    isLoading: false
                });
            });
    }, [setGlobalLoading]);

    return <div className="web-info">
        <Card>
            <Form name="basic"
                form={form}
                autoComplete="off"
                onFinish={onFinish}
                labelCol={{span: 3}}
                preserve={false}>
                <Form.Item
                    label="网站名称"
                    name="webUser"
                >
                    <Input placeholder="网站名称"/>
                </Form.Item>
                <Form.Item
                    label="座右铭"
                    name="motto"
                >
                    <Input placeholder="座右铭"/>
                </Form.Item>
                <Form.Item
                    label="github地址"
                    name="githubLink"
                >
                    <Input placeholder="github地址"/>
                </Form.Item>
                <Form.Item
                    label="个人简介"
                    name="personalDesc"
                >
                    <TextArea placeholder="个人简介"/>
                </Form.Item>
                <Form.Item
                    label="网站简介"
                    name="webDesc"
                >
                    <TextArea placeholder="网站简介"/>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 3, offset: 3 }}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>;
};

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(WebInfo);
