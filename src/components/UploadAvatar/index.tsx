import React, { Component, createRef, ChangeEvent, MouseEvent, DragEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import { toggleGlobalLoading } from '@/redux/reducers/common/actions';
import { Modal, Row, Col, message, Avatar, Button } from 'antd';
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
    setGlobalLoading?: (globalLoading: any) => void,
    onCropUploadSuccess?: (fileObject: any) => void,
    onCropUploadFail?: (error: any) => void
}

interface IStates {
    scale: IScale;
    sourceImg: ISourceImg;
    sourceImgMouseDown: ISourceImgMouseDown;
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

class UploadAvatar extends Component<IProps, IStates> {
    static defaultProps = {
        width: 200,
        height: 200,
        setGlobalLoading: (globalLoading: any) => globalLoading,
        onCropUploadSuccess: () => false,
        onCropUploadFail: () => false
    };

    /* 图片选择区域函数绑定 */
    static preventDefault = (e: DragEvent) => {
        e.preventDefault();
        return false;
    };

    fileInputRef = createRef<HTMLInputElement>();

    canvasRef = createRef<HTMLCanvasElement>();

    constructor(props: IProps) {
        super(props);
        this.state = {
            scale: {
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
            },
            sourceImg: {
                img: '',
                imgUrl: '',
                createImgUrl: ''
            },
            sourceImgMouseDown: {
                on: false,
                mX: 0, // 鼠标按下的坐标
                mY: 0,
                x: 0, // scale原图坐标
                y: 0
            }
        };
    }

    get ratio() {
        const { width, height } = this.props;
        return width && height ? (width / height) : 1;
    }

    get sourceImgMasking() {
        const sic = sourceImgContainer;
        const { width, height } = this.props;
        const sicRatio = sic.width / sic.height; // 原图容器宽高比
        let x = 0;
        let y = 0;
        let w = sic.width;
        let h = sic.height;
        let scales = 1;
        if (this.ratio < sicRatio) {
            scales = sic.height / (height as number);
            w = sic.height * this.ratio;
            x = (sic.width - w) / 2;
        }
        if (this.ratio > sicRatio) {
            scales = sic.width / (width as number);
            h = sic.width / this.ratio;
            y = (sic.height - h) / 2;
        }
        return {
            scale: scales, // 蒙版相对需求宽高的缩放
            x,
            y,
            width: w,
            height: h
        };
    }

    get sourceImgStyle() {
        const { scale } = this.state;
        const top = `${scale.y + this.sourceImgMasking.y}px`;
        const left = `${scale.x + this.sourceImgMasking.x}px`;
        return {
            top,
            left,
            width: `${scale.width}px`,
            height: `${scale.height}px`
        };
    }

    get sourceImgShadeStyle() {
        const sic = sourceImgContainer;
        const sim = this.sourceImgMasking;
        const w = sim.width === sic.width ? sim.width : (sic.width - sim.width) / 2;
        const h = sim.height === sic.height ? sim.height : (sic.height - sim.height) / 2;
        return {
            width: `${w}px`,
            height: `${h}px`
        };
    }

    get rangeShow() {
        const { sourceImg } = this.state;
        return Boolean(sourceImg.img);
    }

    // 生成需求图片
    createImg = (e?: MouseEvent | number) => {
        const { scale, sourceImg, sourceImgMouseDown } = this.state;

        const { width, height } = this.props;
        const canvas = this.canvasRef.current;
        if (!canvas) {
            return false;
        }
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!ctx) {
            return false;
        }
        if (e) {
            if (!sourceImgMouseDown.on) {
                return false;
            }
            // 取消鼠标按下移动状态
            this.setState({
                sourceImgMouseDown: {
                    ...sourceImgMouseDown,
                    on : false
                }
            });
        }
        canvas.width = width as number;
        canvas.height = height as number;
        ctx.clearRect(0, 0, width as number, height as number);
        // 将透明区域设置为白色底边
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width as number, height as number);
        ctx.translate((width as number) * 0.5, (height as number) * 0.5);
        ctx.translate(-(width as number) * 0.5, -(height as number) * 0.5);
        ctx.drawImage(
            sourceImg.img,
            scale.x / this.sourceImgMasking.scale,
            scale.y / this.sourceImgMasking.scale,
            scale.width / this.sourceImgMasking.scale,
            scale.height / this.sourceImgMasking.scale
        );
        this.setState({
            sourceImg: {
                ...sourceImg,
                createImgUrl: canvas.toDataURL('image/png')
            }
        });
    };

    // 剪裁前准备工作
    startCrop = () => {
        const { sourceImg, scale } = this.state;
        const { width, height } = this.props;
        const sim = this.sourceImgMasking;
        let img = new Image();
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
            if (nWidth < (width as number) || nHeight < (height as number)) {
                message.warn('图片像素不达标').then();
                return false;
            }
            if (this.ratio > nRatio) {
                h = w / nRatio;
                y = (sim.height - h) / 2;
            }
            if (this.ratio < nRatio) {
                w = h * nRatio;
                x = (sim.width - w) / 2;
            }
            this.setState({
                scale: {
                    ...scale,
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
                },
                sourceImg: {
                    ...sourceImg,
                    img: img
                }
            }, () => {
                this.createImg();
            });
        };
    };

    // 鼠标按下图片准备移动
    imgStartMove = (e: MouseEvent) => {
        e.preventDefault();
        const { sourceImgMouseDown, scale } = this.state;
        this.setState({
            sourceImgMouseDown: {
                ...sourceImgMouseDown,
                mX: e.screenX,
                mY: e.screenY,
                x: scale.x,
                y: scale.y,
                on: true
            }
        });
    };

    //鼠标按下状态下移动，图片移动
    imgMove = (e: MouseEvent) => {
        e.preventDefault();
        const { sourceImgMouseDown, scale } = this.state;
        const { on, mX, mY, x, y } = sourceImgMouseDown;
        if (on) {
            const sim = this.sourceImgMasking;
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
            this.setState({
                scale: {
                    ...scale,
                    x: rX,
                    y: rY
                }
            });
        }
    };

    // 缩放原图
    zoomImg = (newRange: number) => {
        const { scale } = this.state;
        const { maxWidth, maxHeight, minWidth, minHeight, x, y } = scale;
        const scWidth = scale.width;
        const scHeight = scale.height;
        const sim = this.sourceImgMasking;
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
        this.setState({
            scale: {
                ...scale,
                x: nX,
                y: nY,
                width: nWidth,
                height: nHeight,
                range: newRange
            }
        }, () => {
            const { scale: newScale } = this.state;
            if (newScale.range === newRange) {
                this.createImg();
            }
        });
    };

    // 按钮按下开始放大
    startZoomAdd = () => {
        const { scale } = this.state;
        const zoom = () => {
            const { scale: newScale } = this.state;
            if (newScale.zoomAddOn) {
                let range = 100;
                if (newScale.range < 100) {
                    range = newScale.range + 1;
                }
                this.zoomImg(range);
                setTimeout(() => {
                    zoom();
                }, 60);
            }
        };
        if (scale.range < 100) {
            this.setState({
                scale: {
                    ...scale,
                    zoomAddOn: true
                }
            }, () => {
                zoom();
            });
        }
    };

    // 按钮松开或移开取消放大
    endZoomAdd = () => {
        const { scale } = this.state;
        if (scale.zoomAddOn) {
            this.setState({
                scale: {
                    ...scale,
                    zoomAddOn: false
                }
            });
        }
    };

    // 按钮按下开始缩小
    startZoomSub = () => {
        const { scale } = this.state;
        const zoom = () => {
            const { scale: newScale } = this.state;
            if (newScale.zoomSubOn) {
                let range = 0;
                if (newScale.range > 0) {
                    range = newScale.range - 1;
                }
                this.zoomImg(range);
                setTimeout(() => {
                    zoom();
                }, 60);
            }
        };
        if (scale.range > 0) {
            this.setState({
                scale: {
                    ...scale,
                    zoomSubOn: true
                }
            }, () => {
                zoom();
            });
        }
    };

    // 按钮松开或移开取消缩小
    endZoomSub = () => {
        const { scale } = this.state;
        if (scale.zoomSubOn) {
            this.setState({
                scale: {
                    ...scale,
                    zoomSubOn: false
                }
            });
        }
    };

    zoomChange = (e: FormEvent) => {
        const target = e.target as HTMLInputElement;
        this.zoomImg(parseFloat(target.value));
    };

    reset = () => {
        const { scale, sourceImg } = this.state;
        this.setState({
            scale: {
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
            },
            sourceImg: {
                ...sourceImg,
                img: '',
                imgUrl: '',
                createImgUrl: ''
            }
        });
    };

    fileChange = (e: ChangeEvent) => {
        e.preventDefault();
        const { sourceImg } = this.state;
        const target = e.target as HTMLInputElement;
        const { files } = target;
        this.reset();
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
                this.setState({
                    sourceImg: {
                        ...sourceImg,
                        imgUrl: data
                    }
                }, () => {
                    this.startCrop();
                });
            });
        }
    };

    chooseFile = () => {
        this.fileInputRef.current?.click();
    };

    submitUpload = () => {
        const { sourceImg } = this.state;
        const { thumbnail, setGlobalLoading, onCropUploadSuccess, onCropUploadFail, showModal } = this.props;
        if (setGlobalLoading) {
            setGlobalLoading({
                isLoading: true,
                loadingTips: '上传中...'
            });
        }

        if (!sourceImg.createImgUrl) {
            message.warning('请选择上传图片').then();
            if (setGlobalLoading) {
                setTimeout(() => {
                    setGlobalLoading({
                        isLoading: false
                    });
                }, 300);
            }
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
                        if (onCropUploadSuccess) {
                            onCropUploadSuccess(fileObj);
                        }
                        showModal(false);
                    })
                    .catch((error) => {
                        if (onCropUploadFail) {
                            onCropUploadFail(error);
                        }
                    });
            })
            .catch((err) => {
                message.error(err.msg || '获取上传token失败').then();
            })
            .finally(() => {
                if (setGlobalLoading) {
                    setTimeout(() => {
                        setGlobalLoading({
                            isLoading: false
                        });
                    }, 300);
                }
            });
    };

    render() {
        const { sourceImg, scale } = this.state;
        const { visible, showModal, width, height } = this.props;
        return <Modal title="上传头像"
            maskClosable={false}
            width={600}
            destroyOnClose
            visible={visible}
            afterClose={this.reset}
            footer={null}
            onCancel={() => showModal(false)}>
            <div className="img-copper-wrapper">
                <Row>
                    <Col span={17}>
                        <div className="img-copper-left">
                            <div className="img-copper-con">
                                <img className="img-copper-img" alt=''
                                    src={String(sourceImg.imgUrl)}
                                    style={this.sourceImgStyle}
                                    onDrag={(e) => UploadAvatar.preventDefault(e)}
                                    onDragStart={(e) => UploadAvatar.preventDefault(e)}
                                    onDragEnd={(e) => UploadAvatar.preventDefault(e)}
                                    onDragLeave={(e) => UploadAvatar.preventDefault(e)}
                                    onDragOver={(e) => UploadAvatar.preventDefault(e)}
                                    onDragEnter={(e) => UploadAvatar.preventDefault(e)}
                                    onDrop={(e) => UploadAvatar.preventDefault(e)}
                                    onMouseDown={(e) => this.imgStartMove(e)}
                                    onMouseMove={(e) => this.imgMove(e)}
                                    onMouseUp={(e) => this.createImg(e)}
                                    onMouseOut={(e) => this.createImg(e)}/>
                                <div
                                    style={this.sourceImgShadeStyle}
                                    className="img-copper-img-shade img-copper-img-shade-1"
                                />
                                <div
                                    style={this.sourceImgShadeStyle}
                                    className="img-copper-img-shade img-copper-img-shade-2"
                                />
                            </div>
                            { this.rangeShow ? <div className="img-copper-range">
                                <input
                                    className="img-copper-scale-input"
                                    value={scale.range}
                                    type="range"
                                    step="1"
                                    min="0"
                                    max="100"
                                    onInput={(e) => this.zoomChange(e)}
                                />
                                <i
                                    className="img-copper-scale-down"
                                    onMouseDown={this.startZoomSub}
                                    onMouseOut={this.endZoomSub}
                                    onMouseUp={this.endZoomSub}
                                />
                                <i
                                    className="img-copper-scale-plus"
                                    onMouseDown={this.startZoomAdd}
                                    onMouseOut={this.endZoomAdd}
                                    onMouseUp={this.endZoomAdd}
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
                                    ref={this.fileInputRef}
                                    type="file"
                                    onChange={(e) => this.fileChange(e)}
                                />
                                <Button size="small" style={{ marginRight: '10px' }} type="primary" onClick={this.chooseFile}>选择</Button>
                                <Button size="small" type="primary" onClick={this.submitUpload}>确定</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <canvas style={{ display: 'none' }} ref={this.canvasRef} width={width} height={height} />
            </div>
        </Modal>;
    }
}

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(UploadAvatar);
