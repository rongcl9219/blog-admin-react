import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './refuseError.less';
import image403 from '@/assets/images/error_images/403.png';

const msg: string = '您的请求被拒绝';
const tips: string = '请确定你已登录，或者点击下方按钮返回登录页面';

const RefuseError = () => {
    const navigate = useNavigate();

    const goLoginPage = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <div className='page403_container'>
            <div className='page403_http403'>
                <div className='pic_403'>
                    <img className='pic_403__parent' src={image403} alt='403' />
                </div>
                <div className='tips'>
                    <div className='tips__headline'>{msg}</div>
                    <div className='tips__info'>{tips}</div>
                    <a onClick={goLoginPage} className='tips__return-home'>重新登录</a>
                </div>
            </div>
        </div>
    );
};

export default RefuseError;
