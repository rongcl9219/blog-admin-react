import React, { FC, useCallback } from 'react';
import MarkdownEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import './mdEditor.less';
import { Md5 } from 'ts-md5/dist/md5';
import { getUuid } from '@/utils/tools';
import { CommonApi } from '@/api';
import toolbarArr from './config';

interface IProps {
    previewOnly?: boolean;
    content: string;
    onChange?: (content: string) => void;
    onSave?: (content: string) => void;
}

const MdEditor: FC<IProps> = ({ content, previewOnly, onChange , onSave}) => {

    const initImageData = useCallback((files: Array<File>) => new Promise((resolve) => {
        let fileObj: any = {};
        let keys: string[] = [];
        Array.from(files).forEach((file) => {
            let formData = new FormData();
            let key = Md5.hashStr(getUuid());
            formData.append('file', file, key);
            formData.append('key', key);
            keys.push(key);
            fileObj[key] = formData;
        });
        let keysStr = keys.join(',');
        resolve({ fileObj, keysStr });
    }), []);

    const onUploadImg = useCallback((files: File[], callback: (urls: string[]) => void) => {
        initImageData(files).then((fileData: any) => {
            const { keysStr, fileObj } = fileData;
            return CommonApi.getUploadToken({
                keys: keysStr,
                thumbnail: 'zipImage'
            }).then((res) => {
                let fileArr = res.data;
                let uploadArr: Array<any> = [];
                fileArr.forEach((file: any) => {
                    fileObj[file.key].url = file.url;
                    let formData = fileObj[file.key];
                    formData.append('token', file.token);
                    uploadArr.push(CommonApi.uploadImg(formData));
                });
                return Promise.allSettled(uploadArr).then((data: Array<any>) => {
                    callback(data.map((item) => item.value.status && fileObj[item.value.key].url));
                });
            });
        });
    }, [initImageData]);

    return <MarkdownEditor modelValue={content}
        onChange={onChange}
        previewOnly={previewOnly}
        onSave={onSave}
        onUploadImg={onUploadImg}
        toolbars={toolbarArr} />;
};

MdEditor.defaultProps = {
    previewOnly: false,
    onChange: () => null,
    onSave: () => null
};

export default MdEditor;
