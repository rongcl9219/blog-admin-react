import React, { FC, useState, useMemo } from 'react';
import { SketchPicker } from 'react-color';
import { Popover, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './themePicker.less';

interface IProps {
    handeOk: (color: any) => void,
    handleCancel: () => void
}

const ColorPicker: FC<IProps> = ({ handeOk, handleCancel }) => {
    const [color, setColor] = useState<string>('');
    const onChange = (c: any) => {
        setColor(c.hex);
    };
    return <div>
        <SketchPicker color={color} onChange={onChange} />
        <div><Space><Button type="text" onClick={handleCancel}>取消</Button><Button type="text" onClick={() => handeOk(color)}>确定</Button></Space></div>
    </div>;
};

const ThemePicker = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [color, setColor] = useState<string>('');

    const handleOk = (c: any) => {
        console.log(c);
        setColor(c);
        setVisible(false);
    };

    const handleVisibleChange = (newVisible: boolean) => {
        setVisible(newVisible);
    };

    const pickerBtnStyle = useMemo(() => ({
        backgroundColor: color
    }), [color]);

    return <Popover visible={visible}
        placement="bottomRight"
        trigger="click"
        onVisibleChange={handleVisibleChange}
        content={<ColorPicker handeOk={handleOk} handleCancel={() => setVisible(false)} />}>
        <div className="theme-picker" onClick={() => setVisible(true)}>
            <div className="theme-picker-btn" style={pickerBtnStyle}>
                <DownOutlined />
            </div>
        </div>
    </Popover>;
};

export default ThemePicker;
