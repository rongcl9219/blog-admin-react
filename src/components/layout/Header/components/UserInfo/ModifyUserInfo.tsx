import React, { FC, useCallback, useState } from 'react';
import { Form, Input, Modal, Button } from 'antd';
import UploadAvatar from '@/components/UploadAvatar';

interface IProps {
    visible: boolean;
    showModal: (visible: boolean) => void
}

const ModifyUserInfo: FC<IProps> = ({ visible, showModal }) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;

    const [avatarVisible, setAvatarVisible] = useState<boolean>(false);

    const handleOk = useCallback(() => {
        const val = form.getFieldsValue();
        console.log(val);
    }, [form]);

    return <>
        <Modal title="修改个人信息"
            maskClosable={false}
            width={700}
            destroyOnClose
            cancelText="取消"
            okText="确定"
            visible={visible}
            onOk={handleOk}
            onCancel={() => showModal(false)}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                autoComplete="off"
                colon={false}
                preserve={false}
            >
                <Form.Item
                    label="头像"
                >
                    <Button type="primary" onClick={() => setAvatarVisible(true)}>上传头像</Button>
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                >
                    <Input placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item
                    label="个性签名"
                    name="signature"
                >
                    <TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
        <UploadAvatar visible={avatarVisible} showModal={setAvatarVisible} thumbnail="avatar" />
    </>;
};

export default ModifyUserInfo;
