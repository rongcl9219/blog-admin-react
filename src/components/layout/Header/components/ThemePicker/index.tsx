import React, { FC, useState, useMemo } from 'react';
import { SketchPicker } from 'react-color';
import { Popover, Button, Space } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import { setTheme, themeColor } from '@/theme/theme';
import './themePicker.less';

interface IProps {
    showClose: () => void
}

interface IPreColor {
    color: string;
    title: string;
}

// 默认颜色
const defaultColor = themeColor || '#1890ff';

// 预设颜色
const preDefineColors: IPreColor[] = [
    {
        color: '#ff4500',
        title: '#ff4500'
    },
    {
        color: '#ff8c00',
        title: '#ff8c00'
    },
    {
        color: '#ffd700',
        title: '#ffd700'
    },
    {
        color: '#90ee90',
        title: '#90ee90'
    },
    {
        color: '#00ced1',
        title: '#00ced1'
    },
    {
        color: '#1890ff',
        title: '#1890ff'
    },
    {
        color: '#c71585',
        title: '#c71585'
    },
    {
        color: '#feabba',
        title: '#feabba'
    }
];

const ColorPicker: FC<IProps> = ({ showClose }) => {
    const [color, setColor] = useState<string>(defaultColor);
    const onChange = (c: any) => {
        setColor(c.hex);
    };

    const handleCancel = () => {
        setColor(defaultColor);
        showClose();
    };

    const handleOk = () => {
        setTheme(color);
    };

    return <div className="theme-picker">
        <SketchPicker presetColors={preDefineColors} color={color} onChange={onChange} />
        <div className="theme-picker-tool">
            <Space>
                <Button size="small" onClick={handleCancel}>取消</Button>
                <Button size="small" type="primary" onClick={handleOk}>确定</Button>
            </Space>
        </div>
    </div>;
};

const ThemePicker = () => {
    const [visible, setVisible] = useState<boolean>(false);

    const handleVisibleChange = (newVisible: boolean) => {
        setVisible(newVisible);
    };

    return <Popover visible={visible}
        placement="bottomRight"
        trigger="click"
        onVisibleChange={handleVisibleChange}
        content={<ColorPicker showClose={() => setVisible(false)} />}>
        <div className="theme-picker-trigger" onClick={() => setVisible(true)}>
            <SvgIcon iconClass="theme" />
        </div>
    </Popover>;
};

export default ThemePicker;
