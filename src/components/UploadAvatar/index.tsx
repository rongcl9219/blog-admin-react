import React, { FC, useCallback, useState, useRef, useMemo } from 'react';
import { Modal, Row, Col, message, Avatar, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Md5 } from 'ts-md5/dist/md5';
import { CommonApi } from '@/api';
import './uploadAvatar.less';

interface ISourceImgMouseDown {
    on: boolean;
    mX: number; // 鼠标按下的坐标
    mY: number;
    x: number; // scale原图坐标
    y: number;
}

interface IScale {
    zoomAddOn: boolean; // 按钮缩放事件开启
    zoomSubOn: boolean; // 按钮缩放事件开启
    range: number; // 最大100
    rotateLeft: boolean; // 按钮向左旋转事件开启
    rotateRight: boolean; // 按钮向右旋转事件开启
    x: number;
    y: number;
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    minWidth: number; // 最宽
    minHeight: number;
    naturalWidth: number; // 原宽
    naturalHeight: number;
    sourceImgMouseDown?: ISourceImgMouseDown;
}

interface ISourceImg {
    img: any;
    imgUrl: string | ArrayBuffer | null;
    createImgUrl: string;
}

interface IProps {
    visible: boolean;
    showModal: (visible: boolean) => void,
    width?: number;
    height?: number;
    thumbnail: string;
}

const sourceImgContainer = {
    width: 300,
    height: 240 // 如果生成图比例与此一致会出现bug，先改成特殊的格式吧，哈哈哈
};

const data2blob = (data: any) => {
    let newData: any;
    // eslint-disable-next-line prefer-destructuring
    newData = data.split(',')[1];
    newData = window.atob(newData);
    let ia = new Uint8Array(newData.length);
    for (let i = 0; i < newData.length; i++) {
        ia[i] = newData.charCodeAt(i);
    }
    return new Blob([ia], {
        type: 'image/png'
    });
};

// 将文件转换成base64格式
const getBase64 = (file: any) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    let reader = new FileReader();
    let imgResult: string | ArrayBuffer | null;
    reader.readAsDataURL(file);
    reader.onload = () => {
        imgResult = reader.result;
    };
    reader.onerror = (error) => {
        reject(error);
    };
    reader.onloadend = () => {
        resolve(imgResult);
    };
});

const isAssetTypeAnImage = (ext: string) => ['png', 'jpg', 'jpeg', 'gif'].indexOf(ext.toLowerCase()) !== -1;

const UploadAvatar: FC<IProps> = ({ visible, thumbnail, showModal, width = 200, height= 200 }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [uploadLoading, setUploadLoading] = useState<boolean>(false);

    const [scale, setScale] = useState<IScale>({
        zoomAddOn: false,
        zoomSubOn: false,
        range: 1,
        rotateLeft: false,
        rotateRight: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0,
        minHeight: 0,
        naturalWidth: 0,
        naturalHeight: 0
    });

    /* 图片选择区域函数绑定 */
    const preventDefault = useCallback((e: Event) => {
        e.preventDefault();
        return false;
    }, []);

    const [sourceImgMouseDown, setSourceImgMouseDown] = useState<ISourceImgMouseDown>({
        on: false,
        mX: 0, // 鼠标按下的坐标
        mY: 0,
        x: 0, // scale原图坐标
        y: 0
    });

    const [sourceImg, setSourceImg] = useState<ISourceImg>({
        img: '',
        imgUrl: '',
        createImgUrl: ''
    });

    const ratio = useMemo(() => width && height ? (width / height) : 1, [height, width]);

    const sourceImgMasking = useMemo(() => {
        const sic = sourceImgContainer;
        const sicRatio = sic.width / sic.height; // 原图容器宽高比
        let x = 0;
        let y = 0;
        let w = sic.width;
        let h = sic.height;
        let scales = 1;
        if (ratio < sicRatio) {
            scales = sic.height / height;
            w = sic.height * ratio;
            x = (sic.width - w) / 2;
        }
        if (ratio > sicRatio) {
            scales = sic.width / width;
            h = sic.width / ratio;
            y = (sic.height - h) / 2;
        }
        return {
            scale: scales, // 蒙版相对需求宽高的缩放
            x,
            y,
            width: w,
            height: h
        };
    }, [height, ratio, width]);

    const sourceImgStyle = useMemo(() => {
        const top = `${scale.y + sourceImgMasking.y}px`;
        const left = `${scale.x + sourceImgMasking.x}px`;
        return {
            top,
            left,
            width: `${scale.width}px`,
            height: `${scale.height}px`
        };
    }, [scale.height, scale.width, scale.x, scale.y, sourceImgMasking.x, sourceImgMasking.y]);

    const sourceImgShadeStyle = useMemo(() => {
        const sic = sourceImgContainer;
        const sim = sourceImgMasking;
        const w = sim.width === sic.width ? sim.width : (sic.width - sim.width) / 2;
        const h = sim.height === sic.height ? sim.height : (sic.height - sim.height) / 2;
        return {
            width: `${w}px`,
            height: `${h}px`
        };
    }, [sourceImgMasking]);

    const rangeShow = useMemo(() => Boolean(sourceImg.img), [sourceImg.img]);

    // 生成需求图片
    const createImg = useCallback((e?: Event | number) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return false;
        }
        const ctx: any = canvas?.getContext('2d');
        if (e) {
            // 取消鼠标按下移动状态
            sourceImgMouseDown.on = false;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width as number, height as number);
        // 将透明区域设置为白色底边
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width as number, height as number);
        ctx.translate(width * 0.5, height * 0.5);
        ctx.translate(-width * 0.5, -height * 0.5);
        ctx.drawImage(
            sourceImg.img,
            scale.x / sourceImgMasking.scale,
            scale.y / sourceImgMasking.scale,
            scale.width / sourceImgMasking.scale,
            scale.height / sourceImgMasking.scale
        );
        setSourceImg({
            ...sourceImg,
            createImgUrl: canvas.toDataURL('image/png')
        });
    }, [height, scale.height, scale.width, scale.x, scale.y, sourceImg, sourceImgMasking.scale, sourceImgMouseDown, width]);

    // 剪裁前准备工作
    const startCrop = useCallback(() => {
        const sim = sourceImgMasking;
        const img = new Image();
        img.src = sourceImg.imgUrl as string;
        img.onload = () => {
            const nWidth = img.naturalWidth;
            const nHeight = img.naturalHeight;
            const nRatio = nWidth / nHeight;
            let w = sim.width;
            let h = sim.height;
            let x = 0;
            let y = 0;
            // 图片像素不达标
            if (nWidth < width || nHeight < height) {
                message.warn('图片像素不达标').then();
                return false;
            }
            if (ratio > nRatio) {
                h = w / nRatio;
                y = (sim.height - h) / 2;
            }
            if (ratio < nRatio) {
                w = h * nRatio;
                x = (sim.width - w) / 2;
            }
            setScale({ ...scale,
                range: 0,
                x: x,
                y: y,
                width: w,
                height: h,
                minWidth: w,
                minHeight: h,
                maxWidth: nWidth * sim.scale,
                maxHeight: nHeight * sim.scale,
                naturalWidth: nWidth,
                naturalHeight: nHeight
            });
            setSourceImg({ ...sourceImg, img: img });
            createImg();
        };
    },[createImg, height, ratio, scale, sourceImg, sourceImgMasking, width]);

    // 鼠标按下图片准备移动
    const imgStartMove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setSourceImgMouseDown({
            ...sourceImgMouseDown,
            mX: e.screenX,
            mY: e.screenY,
            x: scale.x,
            y: scale.y,
            on: true
        });
    }, [scale.x, scale.y, sourceImgMouseDown]);

    //鼠标按下状态下移动，图片移动
    const imgMove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { on, mX, mY, x, y } = sourceImgMouseDown;
        const sim = sourceImgMasking;
        const nX = e.screenX;
        const nY = e.screenY;
        const dX = nX - mX;
        const dY = nY - mY;
        let rX = x + dX;
        let rY = y + dY;
        if (!on) {
            return false;
        }
        if (rX > 0) {
            rX = 0;
        }
        if (rY > 0) {
            rY = 0;
        }
        if (rX < sim.width - scale.width) {
            rX = sim.width - scale.width;
        }
        if (rY < sim.height - scale.height) {
            rY = sim.height - scale.height;
        }
        setScale({
            ...scale,
            x: rX,
            y: rY
        });
    }, [scale, sourceImgMasking, sourceImgMouseDown]);

    // 缩放原图
    const zoomImg = useCallback((newRange: number) => {
        const { maxWidth, maxHeight, minWidth, minHeight, x, y } = scale;
        const scWidth = scale.width;
        const scHeight = scale.height;
        const sim = sourceImgMasking;
        // 蒙版宽高
        const sWidth = sim.width;
        const sHeight = sim.height;
        // 新宽高
        const nWidth = minWidth + (maxWidth - minWidth) * newRange / 100;
        const nHeight = minHeight + (maxHeight - minHeight) * newRange / 100;
        // 新坐标（根据蒙版中心点缩放）
        let nX = sWidth / 2 - nWidth / scWidth * (sWidth / 2 - x);
        let nY = sHeight / 2 - nHeight / scHeight * (sHeight / 2 - y);
        // 判断新坐标是否超过蒙版限制
        if (nX > 0) {
            nX = 0;
        }
        if (nY > 0) {
            nY = 0;
        }
        if (nX < sWidth - nWidth) {
            nX = sWidth - nWidth;
        }
        if (nY < sHeight - nHeight) {
            nY = sHeight - nHeight;
        }
        // 赋值处理
        setScale({
            ...scale,
            x: nX,
            y: nY,
            width: nWidth,
            height: nHeight,
            range: newRange
        });
        setTimeout(() => {
            if (scale.range === newRange) {
                createImg();
            }
        }, 300);
    }, [createImg, scale, sourceImgMasking]);

    // 按钮按下开始放大
    const startZoomAdd = useCallback(() => {
        setScale({
            ...scale,
            zoomAddOn: true
        });
        const zoom = () => {
            if (scale.zoomAddOn) {
                const range = scale.range >= 100 ? 100 : ++scale.range;
                zoomImg(range);
                setTimeout(() => {
                    zoom();
                }, 60);
            }
        };
        zoom();
    }, [scale, zoomImg]);

    // 按钮松开或移开取消放大
    const endZoomAdd = useCallback(() => {
        setScale({
            ...scale,
            zoomAddOn: false
        });
    }, [scale]);

    // 按钮按下开始缩小
    const startZoomSub = useCallback(() => {
        setScale({
            ...scale,
            zoomSubOn: true
        });
        const zoom = () => {
            if (scale.zoomSubOn) {
                const range = scale.range <= 0 ? 0 : --scale.range;
                zoomImg(range);
                setTimeout(() => {
                    zoom();
                }, 60);
            }
        };
        zoom();
    }, [scale, zoomImg]);

    // 按钮松开或移开取消缩小
    const endZoomSub = useCallback(() => {
        setScale({
            ...scale,
            zoomSubOn: false
        });
    }, [scale]);

    const zoomChange = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        zoomImg(parseFloat(target.value));
    }, [zoomImg]);

    const reset = useCallback(() => {
        setScale({
            ...scale,
            zoomAddOn: false, // 按钮缩放事件开启
            zoomSubOn: false, // 按钮缩放事件开启
            range: 1, // 最大100
            rotateLeft: false, // 按钮向左旋转事件开启
            rotateRight: false, // 按钮向右旋转事件开启
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            maxWidth: 0,
            maxHeight: 0,
            minWidth: 0, // 最宽
            minHeight: 0,
            naturalWidth: 0, // 原宽
            naturalHeight: 0,
            sourceImgMouseDown: {
                on: false,
                mX: 0, // 鼠标按下的坐标
                mY: 0,
                x: 0, // scale原图坐标
                y: 0
            }
        });

        setSourceImg({
            ...sourceImg,
            img: '',
            imgUrl: '',
            createImgUrl: ''
        });
    }, [scale, sourceImg]);

    const fileChange = useCallback((e: Event) => {
        console.log('fileChange');
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const { files } = target;
        reset();
        if (files && files.length > 0) {
            const file: File = files[0];

            // 获取最后一个.的位置
            let index = file.name.lastIndexOf('.');
            // 获取后缀
            let ext = file.name.substring(index + 1);
            // 判断文件类型是否符合
            if (!isAssetTypeAnImage(ext)) {
                message.error('只能上传jpg/jpeg/png/gif文件!').then();
                return false;
            }
            // 判断文件大小是否符合
            if (!(file.size / 1024 / 1024 <= 5)) {
                message.error('上传文件大小不能超过5MB!').then();
                return false;
            }

            // 将图片地址赋值给裁剪框显示图片
            // 无法直接读取，先转成base64格式
            getBase64(file).then((data) => {
                sourceImg.imgUrl = data;
                startCrop();
            });
        }
    }, [reset, sourceImg, startCrop]);

    const chooseFile = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const submitUpload = useCallback(() => {
        setUploadLoading(true);

        if (!sourceImg.createImgUrl) {
            message.warning('请选择上传图片').then();
            setUploadLoading(false);
            return false;
        }

        const file = data2blob(sourceImg.createImgUrl);

        //  用FormData存放上传文件
        let formData = new FormData();
        let key = Md5.hashStr(new Date().getTime().toString());
        formData.append('file', file, key);
        formData.append('key', key);

        CommonApi.getUploadToken({ keys: key, thumbnail: thumbnail })
            .then((res) => {
                let data = res.data[0];
                formData.append('token', data.token);
                CommonApi.uploadImg(formData)
                    .then(() => {
                        let fileObj = {
                            key: key,
                            url: data.url
                        };
                        console.log(fileObj);
                        // onCropUploadSuccess(fileObj);
                    })
                    .catch((error) => {
                        console.log(error);
                        // onCropUploadFail(error);
                    })
                    .finally(() => {
                        setUploadLoading(false);
                    });
            })
            .catch((err) => {
                message.error(err.msg || '获取上传token失败').then();
            })
            .finally(() => {
                setUploadLoading(false);
            });
    }, [sourceImg.createImgUrl, thumbnail]);

    return <Spin spinning={uploadLoading} indicator={<LoadingOutlined />} tip="上传中...">
        <Modal title="上传头像"
            maskClosable={false}
            width={600}
            destroyOnClose
            visible={visible}
            footer={null}
            onCancel={() => showModal(false)}>
            <div className="img-copper-wrapper">
                <Row>
                    <Col span={17}>
                        <div className="img-copper-left">
                            <div className="img-copper-con">
                                <img className="img-copper-img" alt=''
                                    src={String(sourceImg.imgUrl)}
                                    style={sourceImgStyle}
                                    onDrag={() => preventDefault}
                                    onDragStart={() => preventDefault}
                                    onDragEnd={() => preventDefault}
                                    onDragLeave={() => preventDefault}
                                    onDragOver={() => preventDefault}
                                    onDragEnter={() => preventDefault}
                                    onDrop={() => preventDefault}
                                    onMouseDown={() => imgStartMove}
                                    onMouseMove={() => imgMove}
                                    onMouseUp={() => createImg}
                                    onMouseOut={() => createImg}/>
                                <div
                                    style={sourceImgShadeStyle}
                                    className="img-copper-img-shade img-copper-img-shade-1"
                                />
                                <div
                                    style={sourceImgShadeStyle}
                                    className="img-copper-img-shade img-copper-img-shade-2"
                                />
                            </div>
                            { rangeShow ? <div className="img-copper-range">
                                <input
                                    className="img-copper-scale-input"
                                    value={scale.range}
                                    type="range"
                                    step="1"
                                    min="0"
                                    max="100"
                                    onInput={() => zoomChange}
                                />
                                <i
                                    className="img-copper-scale-down"
                                    onMouseDown={startZoomSub}
                                    onMouseOut={endZoomSub}
                                    onMouseUp={endZoomSub}
                                />
                                <i
                                    className="img-copper-scale-plus"
                                    onMouseDown={startZoomAdd}
                                    onMouseOut={endZoomAdd}
                                    onMouseUp={endZoomAdd}
                                />
                            </div> : null }
                        </div>
                    </Col>
                    <Col span={7}>
                        <div className="img-copper-right">
                            <div className="size-one">
                                <Avatar shape="square" size={100} src={sourceImg.createImgUrl} />
                                <span>方形预览</span>
                            </div>
                            <div className="size-two">
                                <Avatar size={100} src={sourceImg.createImgUrl} />
                                <span>圆形预览</span>
                            </div>
                            <div className="upload-avatar">
                                <input
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={() => fileChange}
                                />
                                <Button size="small" style={{ marginRight: '10px' }} type="primary" onClick={chooseFile}>选择</Button>
                                <Button size="small" type="primary" onClick={submitUpload}>确定</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <canvas style={{ display: 'none' }} ref={canvasRef} width={width} height={height} />
            </div>
        </Modal>
    </Spin>;
};

UploadAvatar.defaultProps = {
    width: 200,
    height: 200
};

export default UploadAvatar;
