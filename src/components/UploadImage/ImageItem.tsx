import React, { FC, useState } from 'react'
import { Image } from 'antd'
import { DeleteOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons'

interface IProps {
    file: any;
    width: number;
    height: number;
    onRemove: () => void;
}

const ImageItem: FC<IProps> = ({file, width, height, onRemove}) => {
    const [visible, setVisible] = useState<boolean>(false)

    const [loaded, setLoaded] = useState<boolean>(false)

    const style: React.CSSProperties = {
        width: `${width}px`,
        height: `${height}px`
    }

    const url = (file.response ? file.response.url : '') || file.url || file.thumbUrl

    const imgOnload = () => {
        setLoaded(true)
    }

    return <div className="image-card" style={style}>
        <div className="image-card-con">
            <img src={url} alt="" onLoad={imgOnload} onLoadCapture={imgOnload}/>
        </div>
        {
            loaded ?
                <div className="image-card-mask img-mask">
                    <EyeOutlined className="opt-btn" onClick={() => setVisible(true)}/>
                    <DeleteOutlined className="opt-btn" onClick={() => onRemove()}/>
                </div> :
                <div className="image-load-mask img-mask"><LoadingOutlined className="opt-btn" style={{fontSize: '20px'}} /></div>
        }
        <Image src={url} style={{ display: 'none' }} preview={{
            visible,
            src: url,
            onVisibleChange: value => {
                setVisible(value)
            }
        }} />
    </div>
}

export default ImageItem
