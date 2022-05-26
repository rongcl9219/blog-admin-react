import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './notFound.less';
import image404 from '@/assets/images/error_images/404.png';
import cloudImage from '@/assets/images/error_images/404_cloud.png';

const msg: string = '访问的页面不存在';

const tips: string = '请检查您输入的地址是否正确，或者点击下方按钮返回首页。';

const NotFound = () => {
    const navigate = useNavigate();

    const goHomePage = useCallback(() => {
        navigate('/');
    }, [navigate]);

    return (
        <div className='page404_container'>
            <div className='page404_http404'>
                <div className='pic-404'>
                    <img className='pic-404__parent' src={image404} alt='404' />
                    <img
                        className='pic-404__child left'
                        src={cloudImage}
                        alt='404'
                    />
                    <img
                        className='pic-404__child mid'
                        src={cloudImage}
                        alt='404'
                    />
                    <img
                        className='pic-404__child right'
                        src={cloudImage}
                        alt='404'
                    />
                </div>
                <div className='tips'>
                    <div className='tips__headline'>{ msg }</div>
                    <div className='tips__info'>{ tips }</div>
                    <a onClick={goHomePage} className='tips__return-home'>返回首页</a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
