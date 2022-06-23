import React, {Component} from 'react';
import {Card, Form, Input, Button, message, Avatar} from 'antd';
import {WebInfoApi} from '@/api';
import {connect} from 'react-redux';
import {toggleGlobalLoading} from '@/redux/reducers/common/actions';
import UploadAvatar from '@/components/UploadAvatar';
import type {FormInstance} from 'antd/es/form';

interface IProps {
    setGlobalLoading: (globalLoading: GIGlobalLoading) => void;
}

interface IAvatar {
    url: string;
    key: string;
}

interface IState {
    avatarVisible: boolean,
    avatar: IAvatar
}

interface WebInfoForm {
    webUser: string;
    githubLink: string;
    avatar: IAvatar;
    webBanner: Array<GIFileInfo>;
    motto: string;
    personalDesc: string;
    webDesc: string;
}

class WebInfo extends Component<IProps, IState> {
    static avatarUploadError = (error: any) => {
        message.error(error.msg || '上传失败').then();
    };

    formRef = React.createRef<FormInstance>();

    constructor(props: any) {
        super(props);
        this.state = {
            avatarVisible: false,
            avatar: {
                url: '',
                key: ''
            }
        };
    }

    componentDidMount() {
        const {setGlobalLoading} = this.props;
        setGlobalLoading({
            isLoading: true,
            loadingTips: '加载中...'
        });

        WebInfoApi.getWebInfo().then(res => {
            const {paramData} = res.data;
            this.formRef.current?.setFieldsValue({
                webUser: paramData.WEB_USER || '',
                githubLink: paramData.GITHUB_LINK || '',
                personalDesc: paramData.PERSONAL_DESC || '',
                webDesc: paramData.WEB_DESC || '',
                motto: paramData.MOTTO || ''
            });
            if (paramData.WEB_AVATAR) {
                this.setState({
                    avatar: paramData.WEB_AVATAR
                });
            }
        }).finally(() => {
            setGlobalLoading({
                isLoading: false
            });
        });
    }

    componentWillUnmount() {
        this.setState = () => false;
    }

    avatarUploadSuccess = (fileObj: any) => {
        message.success('上传成功').then();
        this.setState({
            avatar: {
                url: fileObj.url,
                key: fileObj.key
            }
        });
    };

    onFinish = (values: WebInfoForm) => {
        const {setGlobalLoading} = this.props;
        const {avatar} = this.state;
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
            WEB_AVATAR: avatar.key || '',
            PERSONAL_DESC: values.personalDesc,
            WEB_DESC: values.webDesc,
            MOTTO: values.motto,
            WEB_BANNER: webBanner
        };

        WebInfoApi.saveWebInfo({paramObj})
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
    };

    render() {
        const {avatarVisible, avatar} = this.state;
        return <div className="web-info">
            <Card>
                <Form name="basic"
                    ref={this.formRef}
                    autoComplete="off"
                    onFinish={this.onFinish}
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
                        label="头像"
                    >
                        {avatar.url ?
                            <Avatar style={{marginRight: '10px'}} src={avatar.url} size={60} shape="square"/> : null}
                        <Button type="primary" onClick={() => {
                            this.setState({
                                avatarVisible: true
                            });
                        }}>上传头像</Button>
                    </Form.Item>
                    <Form.Item
                        label="个人简介"
                        name="personalDesc"
                    >
                        <Input.TextArea placeholder="个人简介"/>
                    </Form.Item>
                    <Form.Item
                        label="网站简介"
                        name="webDesc"
                    >
                        <Input.TextArea placeholder="网站简介"/>
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 3, offset: 3}}>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <UploadAvatar visible={avatarVisible}
                showModal={(visible) => {
                    this.setState({
                        avatarVisible: visible
                    });
                }}
                onCropUploadSuccess={this.avatarUploadSuccess}
                onCropUploadFail={WebInfo.avatarUploadError}
                thumbnail="avatar"/>
        </div>;
    }
}

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(WebInfo);
