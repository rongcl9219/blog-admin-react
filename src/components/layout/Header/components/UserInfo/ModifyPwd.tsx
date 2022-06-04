import React, { FC } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserApi } from '@/api';

interface IProps {
    visible: boolean;
    showModal: (visible: boolean) => void
}

interface PasswordForm {
    oldPass: string;
    newPass: string;
    checkPass: string;
}

const ModifyPwd: FC<IProps> = ({visible, showModal}) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const newPass = Form.useWatch('newPass', form);

    const validatePassword: RuleValidator<string> = (rule, value): Promise<void> => new Promise((resolve, reject) => {
        if (!value || value.trim() === '') {
            reject(new Error('请输入新密码'));
        } else if (!/^(?![^a-zA-Z]+$)(?!\\D+$).{8,16}$/.test(value)) {
            reject(new Error('密码必须包含且只能由数字和字母组成，长度8~16'));
        } else {
            resolve();
        }
    });

    const checkPassword: RuleValidator<string> = (rule, value): Promise<void> => new Promise((resolve, reject) => {
        if (!value || value.trim() === '') {
            reject(new Error('请再次输入密码'));
        } else if (newPass && value !== newPass) {
            reject(new Error('两次密码输入不一致'));
        } else {
            resolve();
        }
    });

    const handleOk = () => {
        form.validateFields().then((values: PasswordForm) => {
            UserApi.updatePassword(values).then(() => {
                message.success('修改成功', 1).then(() => {
                    navigate('/login', {replace: true});
                });
            });
        }).catch((error) => error);
    };

    return <Modal title="修改密码"
        maskClosable={false}
        width={700}
        destroyOnClose
        visible={visible}
        onOk={handleOk}
        cancelText="取消"
        okText="确定"
        onCancel={() => showModal(false)}>
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
                label="输入旧密码"
                name="oldPass"
                validateTrigger={['onBlur']}
                rules={[{ required: true, message: '请输入旧密码' }]}
            >
                <Input placeholder="请输入旧密码" />
            </Form.Item>
            <Form.Item
                label="输入新密码"
                name="newPass"
                validateTrigger={['onBlur']}
                rules={[{ required: true, validator: validatePassword }]}
            >
                <Input placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item
                label="再次输入新密码"
                name="checkPass"
                validateTrigger={['onBlur']}
                rules={[{ required: true, validator: checkPassword }]}
            >
                <Input placeholder="请再次输入新密码" />
            </Form.Item>
        </Form>
    </Modal>;
};

export default ModifyPwd;
