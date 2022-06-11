import React, { FC } from 'react';
import noDataImage from '@/assets/images/default_img/no_data.png';
import './noData.less';

interface IProps {
    noDateText?: string,
    style?: React.CSSProperties,
    className?: string;
}

const NoData: FC<IProps> = ({ noDateText, style, className }) => <div className={`no-data  ${className}`} style={style}>
    <img src={noDataImage} alt=""/>
    <p>{ noDateText }</p>
</div>;

NoData.defaultProps = {
    noDateText: '什么都没有',
    style: {},
    className: ''
};

export default NoData;
