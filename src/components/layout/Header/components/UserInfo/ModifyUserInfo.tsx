import React, { FC, useState, useEffect } from 'react';
import { Form, Input, Modal, Button, message, Avatar } from 'antd';
import { connect } from 'react-redux';
import { setUserAvatar } from '@/redux/reducers/user/actions';
import { toggleGlobalLoading } from '@/redux/reducers/common/actions';
import UploadAvatar from '@/components/UploadAvatar';
import { UserApi } from '@/api';

interface IProps {
    visible: boolean;
    showModal: (visible: boolean) => void,
    setAvatar: (avatar: string) => void,
    setGlobalLoading: (globalLoading: any) => void
}

interface IUserInfoForm {
    avatar: string;
    avatarUrl: string;
    userId: string;
}

const ModifyUserInfo: FC<IProps> = ({ visible, showModal, setAvatar, setGlobalLoading }) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;

    const [avatarVisible, setAvatarVisible] = useState<boolean>(false);

    const [userInfo, setUserInfo] = useState<IUserInfoForm>({
        avatar: '',
        avatarUrl: '',
        userId: ''
    });

    useEffect(() => {
        if (visible && !userInfo.userId) {
            UserApi.getUserInfo().then(res => {
                const newUserInfo = res.data.userInfo;
                setUserInfo({
                    ...userInfo,
                    avatar: newUserInfo.avatar,
                    avatarUrl: newUserInfo.avatarUrl,
                    userId: newUserInfo.userId
                });
                form.setFieldsValue({
                    email: newUserInfo.email,
                    signature: newUserInfo.signature
                });
            }).catch(error => {
                message.error(error.msg || '获取信息失败').then();
            });
        }
    }, [form, userInfo, visible]);

    const avatarUploadSuccess = (fileObj: any) => {
        message.success('上传成功').then();
        setUserInfo({
            ...userInfo,
            avatar: fileObj.key,
            avatarUrl: fileObj.url
        });
    };

    const avatarUploadError = (error: any) => {
        message.error(error.msg || '上传失败').then();
    };

    const updateUserInfo = () => {
        setGlobalLoading({
            isLoading: true,
            globalTips: '保存中...'
        });
        const formVal = form.getFieldsValue();
        const data = {
            avatar: userInfo.avatar,
            signature: formVal.signature,
            email: formVal.email,
            userId: userInfo.userId
        };

        UserApi.updateUserInfo(data).then(() => {
            message.success('保存成功').then();
            setAvatar(userInfo.avatarUrl);
            showModal(false);
        }).catch(() => {
            message.error('保存失败').then();
        }).finally(() => {
            setGlobalLoading({
                isLoading: false
            });
        });
    };

    const handleCloseModal = () => {
        setUserInfo({
            avatar: '',
            avatarUrl: '',
            userId: ''
        });
    };

    return <>
        <Modal title="修改个人信息"
            maskClosable={false}
            width={700}
            destroyOnClose
            cancelText="取消"
            okText="确定"
            visible={visible}
            afterClose={handleCloseModal}
            onOk={updateUserInfo}
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
                    { userInfo.avatarUrl ? <Avatar style={{ marginRight: '10px' }} src={userInfo.avatarUrl} size={60} shape="square" /> : null }
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
        <UploadAvatar visible={avatarVisible}
            showModal={setAvatarVisible}
            onCropUploadSuccess={avatarUploadSuccess}
            onCropUploadFail={avatarUploadError}
            thumbnail="avatar" />
    </>;
};

export default connect(() => ({}), {
    setAvatar: setUserAvatar,
    setGlobalLoading: toggleGlobalLoading
})(ModifyUserInfo);
