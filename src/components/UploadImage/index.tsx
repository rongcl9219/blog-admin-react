import React, { FC, useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { message, Upload, Button } from 'antd'
import './uploadImage.less'
import type { UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { Md5 } from 'ts-md5'
import { CommonApi } from '@/api'
import ImageItem from '@/components/UploadImage/ImageItem'

interface IProps {
    value?: Array<GIFileInfo>;
    onChange?: (value: Array<GIFileInfo>) => void;
    style?: React.CSSProperties;
    className?: string;
    maxCount?: number;
    width?: number;
    height?:number;
}

/**
 * @description 判断文件是否是图片
 * @param ext 文件后缀
 */
const isAssetTypeAnImage = (ext: string) => ['png', 'jpg', 'jpeg'].indexOf(ext.toLowerCase()) !== -1

const UploadImage: FC<IProps> = ({value = [], className = '', onChange, style = {}, maxCount, width = 100, height = 100}) => {
    const [initFlag, setInitFlag] = useState<boolean>(false)
    const [newFileList, setFileList] = useState<Array<UploadFile>>([])

    const customRequest = ({file, onError, onSuccess}: any) => {
        //  用FormData存放上传文件
        let formData = new FormData()
        let key = Md5.hashStr(new Date().getTime().toString())
        formData.append('file', file, key)
        formData.append('key', key)

        CommonApi.getUploadToken({ keys: key, thumbnail: 'zipImage' })
            .then((res) => {
                let fileData = res.data[0]
                formData.append('token', fileData.token)

                CommonApi.uploadImg(formData).then(() => {
                    let fileObj = {
                        key: key,
                        url: fileData.url
                    }
                    onSuccess(fileObj)
                }).catch(onError)
            }).catch(onError)
    }

    const handleChange: UploadProps['onChange'] = ({ fileList}) => {
        const list = fileList.map(file => {
            let newFile = file
            if (newFile && newFile.status === 'done' && newFile.response && newFile.response.imgUrl) {
                newFile.thumbUrl = newFile.response.url
            }
            return newFile
        })
        setFileList(list)
        let newList: Array<GIFileInfo> = []

        list.forEach(file => {
            if (file.response) {
                newList.push(file.response)
            }
        })

        onChange?.(newList)
    }

    /**
     * 文件上传前
     * @param file
     * @param fileList
     */
    const beforeUpload: UploadProps['beforeUpload'] = (file, fileList) => new Promise((resolve) => {
        // 使用reject阻止仍然会上传，使用flag进行判断
        let flag = true

        // 判断上传文件数
        if (maxCount && maxCount > 0) {
            if (newFileList.length >= maxCount) {
                message.error(`最多上传${maxCount}个文件!`).then()
                flag = false
            }
        }

        // 获取最后一个.的位置
        let index = file.name.lastIndexOf('.')
        // 获取后缀
        let ext = file.name.substring(index + 1)
        // 判断文件类型是否符合
        if (!isAssetTypeAnImage(ext)) {
            // 必须手动移除，不然已选择的文件还存在list中
            fileList.splice(-1, 1)
            message.error('只能上传jpg/jpeg/png文件!').then()
            flag = false
        }

        // 判断文件大小是否符合
        if (!(file.size / 1024 / 1024 <= 5)) {
            // 必须手动移除，不然已选择的文件还存在list中
            fileList.splice(-1, 1)
            message.error('上传文件大小不能超过5MB!').then()
            flag = false
        }

        if (flag) {
            resolve()
        }
    })

    const onRemove = (file: UploadFile) => {
        const fileList = newFileList.filter(item => item.uid !== file.uid)
        setFileList(fileList)
        let newList: Array<GIFileInfo> = []

        fileList.forEach(item => {
            if (item.response) {
                newList.push(item.response)
            }
        })

        onChange?.(newList)
    }

    useEffect(() => {
        if (!initFlag) {
            if (value && value.length > 0) {
                setInitFlag(true)
                const fileList = value.map((file) => {
                    const newFile: UploadFile = {
                        uid: file.key,
                        name: file.key,
                        status: 'done',
                        url: file.url,
                        thumbUrl: file.url,
                        response: file
                    }
                    return newFile
                })
                setFileList(fileList)
            }
        }
    }, [value, initFlag])

    return <div className={className} style={style}>
        <div className="image-upload-list-card">
            {
                newFileList.map(file => <ImageItem key={file.uid} width={width} height={height} file={file} onRemove={() => onRemove(file)}/>)
            }
        </div>
        <Upload fileList={newFileList}
            showUploadList={false}
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            onChange={handleChange}>
            {
                maxCount && maxCount > 0 ?
                    newFileList.length >= maxCount ? null : <div>
                        <Button type="dashed" style={{width: `${width}px`, height: `${height}px`, fontSize: '30px'}}><PlusOutlined/></Button>
                    </div> :
                    <Button type="dashed"><PlusOutlined/></Button>
            }
        </Upload>
    </div>
}

UploadImage.defaultProps = {
    value: [],
    onChange: () => false,
    style: {},
    className: '',
    maxCount: 0,
    width: 100,
    height: 100
}

export default UploadImage
