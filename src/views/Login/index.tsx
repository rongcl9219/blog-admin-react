import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import SvgIcon from '@/components/SvgIcon';
import ValidCode from '@/components/ValidCode';
import { userLogin, userLoginOut } from '@/redux/reducers/user/actions';
import { UserApi } from '@/api';
import './login.less';

interface LoginForm {
    username: string;
    password: string;
}

interface IState {
    validCode: string;
    passwordType: boolean;
    codeRefresh: number;
    loginSuccess: boolean;
    isLoading: boolean;
}

interface IProps {
    login: (username: string, password: string) => Promise<any>,
    loginOut: () => Promise<any>
}

class Login extends Component<IProps, IState> {
    static initAdmin = () => {
        UserApi.initSysAdmin()
            .then((res) => {
                message.success(`初始化成功！用户名为：${res.data.username}，密码为：${res.data.password}`).then();
            })
            .catch((error) => {
                message.error(error.msg || '初始化失败').then();
            });
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            validCode: '',
            codeRefresh: 0,
            passwordType: true,
            loginSuccess: false,
            isLoading: false
        };
    }

    componentDidMount() {
        const { loginOut } = this.props;
        loginOut().then();
    }

    onFinish = (values: LoginForm) => {
        const { username, password } = values;
        const { login } = this.props;
        this.setState({
            isLoading: true
        });
        login(username, password).then(() => {
            this.setState({
                loginSuccess: true
            });
        }).catch((error) => {
            console.error(error);
            message.error(error.msg || '登录失败').then();
            const { codeRefresh } = this.state;
            this.setState({
                codeRefresh: codeRefresh + 1
            });
        }).finally(() => {
            this.setState({
                isLoading: false
            });
        });
    };

    togglePwdType = () => {
        const { passwordType } = this.state;
        this.setState({
            passwordType: !passwordType
        });
    };

    checkValidCode: RuleValidator<string> = (rule, value): Promise<void> => new Promise((resolve, reject) => {
        const { validCode, codeRefresh } = this.state;
        if (!value || value.trim() === '') {
            reject(new Error('请输入验证码'));
        } else if (value.toLocaleUpperCase() !== validCode.toLocaleUpperCase()) {
            this.setState({
                codeRefresh: codeRefresh + 1
            });
            reject(new Error('验证码错误'));
        } else {
            resolve();
        }
    });

    render() {
        const { passwordType, codeRefresh, loginSuccess, isLoading } = this.state;
        return <div className="login-container">
            { loginSuccess ? <Navigate to="/" replace /> : '' }
            <div className="login-card">
                <h3 className="title">后台登录</h3>
                <Form
                    name="basic"
                    initialValues={{
                        username: '',
                        password: '',
                        validCode: ''
                    }}
                    onFinish={this.onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        validateTrigger={['onChange','onBlur']}
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input className="login-input" prefix={<SvgIcon iconClass="user" className="login-icon" />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item style={{ margin: '0px' }}>
                        <Form.Item
                            name="password"
                            validateTrigger={['onChange','onBlur']}
                            rules={[{ required: true, message: '请输入密码' }]}>
                            <Input
                                className="login-input"
                                prefix={<SvgIcon iconClass="password" className="login-icon" />}
                                type={ passwordType ? 'password' : 'text'}
                                placeholder="密码"
                            />
                        </Form.Item>
                        <span className="show-pwd" onClick={this.togglePwdType}>
                            {
                                passwordType ? <SvgIcon iconClass="eyes-close" /> : <SvgIcon iconClass="eyes" />
                            }
                        </span>
                    </Form.Item>
                    <Form.Item style={{ margin: '0px' }}>
                        <Form.Item
                            name="validCode"
                            style={{ width: '70%', display: 'inline-block' }}
                            validateTrigger={['onBlur']}
                            rules={[{ required: true, validator: this.checkValidCode }]}
                        >
                            <Input className="login-input" prefix={<SvgIcon iconClass="verification-code" className="login-icon" />} placeholder="验证码，不区分大小写" />
                        </Form.Item>
                        <ValidCode refresh={codeRefresh} height={47} onChange={(validCode) => {
                            this.setState({
                                validCode: validCode
                            });
                        }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" loading={isLoading} htmlType="submit" block style={{ marginTop: '10px' }}>
                            登录
                        </Button>
                        <Button type="primary" block style={{ marginTop: '30px' }} onClick={Login.initAdmin}>
                            初始化管理员
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>;
    }
}

export default connect(() => ({}), {
    login: userLogin,
    loginOut: userLoginOut
})(Login);
