import React, { FC, useEffect, useState } from 'react'
import { Button, Drawer, Form, Input, message, Select, Space } from 'antd'
import UploadImage from '@/components/UploadImage'
import { ArticleApi, ClassApi, TagApi } from '@/api'
import { TagInfo } from '@/api/tag/types'
import { ClassInfo } from '@/api/class/types'
import { ArticleInfo } from '@/api/article/types'

interface IProps {
    // type 1-新增 2-编辑
    type: number;
    articleId?: string;
    getArticleList: () => void;
    visible: boolean;
    setVisible: (visible: boolean, type?: number, articleId?: string) => void;
}

const ArticleForm: FC<IProps> = ({type = 1, articleId, getArticleList, visible, setVisible}) => {
    const [classTypeList, setClassTypeList] = useState<Array<ClassInfo>>([])

    const [tagTypeList, setTagTypeList] = useState<Array<TagInfo>>([])

    const [submitLoading, setSubmitLoading] = useState<boolean>(false)

    const [articleForm] = Form.useForm()

    const articleClassType = Form.useWatch('classType', articleForm)

    useEffect(() => {
        if (visible) {
            ClassApi.getAllClass().then((res) => {
                setClassTypeList(res.data)
            }).catch()

            TagApi.getAllTag().then((res) => {
                setTagTypeList(res.data)
            }).catch()
        }
    }, [visible])

    useEffect(() => {
        if (visible && type === 2 && articleId) {
            ArticleApi.getArticleInfo(articleId).then(res => {
                const classType = res.data.classType.split(',').map(Number)
                articleForm.setFieldsValue({
                    articleTitle: res.data.articleTitle,
                    articleKeyword: res.data.articleTitle,
                    articleInfo: res.data.articleTitle,
                    articleCover: [res.data.articleCoverInfo],
                    classType: classType,
                    tagType: res.data.tagType.split(',').map(Number)
                })
            })
        }
    }, [articleId, type, visible, articleForm])

    const saveArticle = (articleData: ArticleInfo) => {
        if (type === 2 && articleId) {
            return ArticleApi.editArticle({
                ...articleData,
                articleId: articleId
            })
        }
        return ArticleApi.newArticle(articleData)
    }

    const handleSubmit = () => {
        if (submitLoading) {
            return false
        }
        setSubmitLoading(true)
        articleForm.validateFields().then((value: any) => {
            const articleInfo: ArticleInfo = {
                articleTitle: value.articleTitle,
                articleKeyword: value.articleKeyword,
                articleInfo: value.articleInfo,
                articleCover: value.articleCover[0].key,
                classType: value.classType.join(','),
                tagType: value.tagType.join(',')
            }
            saveArticle(articleInfo).then(res => {
                if (res.code === 200) {
                    message.success('保存成功').then()
                    getArticleList()
                    setVisible(false)
                } else {
                    message.error('保存失败').then()
                }
            }).catch(error => {
                console.error(error)
                message.error('保存失败').then()
            }).finally(() => {
                setTimeout(() => {
                    setSubmitLoading(false)
                }, 500)
            })
        }).catch(() => {
            setSubmitLoading(false)
        })
    }

    const handleDrawerClose = () => {
        setVisible(false)
        setSubmitLoading(false)
        articleForm.resetFields()
    }

    const handleClassTypeChange = (value: Array<number>) => {
        if (value.length === 0) {
            articleForm.setFieldsValue({'tagType': []})
        }
    }

    return <Drawer
        title={`${type === 1 ? '新增' : '编辑'}文章信息`}
        visible={visible}
        closable={false}
        keyboard={false}
        width={600}
        destroyOnClose
        placement="left"
        maskClosable={false}>
        <Form labelCol={{ span: 4 }}
            colon={false}
            preserve={false}
            form={articleForm}>
            <Form.Item
                name="articleTitle"
                label="文章标题"
                rules={[{ required: true, message: '请输入文章标题' }]}
            >
                <Input placeholder="请输入文章标题" />
            </Form.Item>
            <Form.Item
                name="articleKeyword"
                label="文章关键词"
            >
                <Input placeholder="文章关键词" />
            </Form.Item>
            <Form.Item
                name="articleInfo"
                label="文章简介"
                rules={[{ required: true, message: '请输入文章简介' }]}
            >
                <Input.TextArea placeholder="文章简介" />
            </Form.Item>
            <Form.Item
                name="articleCover"
                label="文章封面"
                rules={[{ required: true, message: '请选择文章封面' }]}
            >
                <UploadImage maxCount={1} />
            </Form.Item>
            <Form.Item
                name="classType"
                label="所属类型"
                rules={[{ required: true, message: '请选择所属类型' }]}
            >
                <Select placeholder="请选择所属类型" mode="multiple" onChange={handleClassTypeChange}>
                    {
                        classTypeList.map(classType => <Select.Option key={classType.classId} value={classType.classId}>{classType.className}</Select.Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="tagType"
                label="文章标签"
                rules={[{ required: true, message: '请选择文章标签' }]}
            >
                <Select placeholder="请选择文章标签" mode="multiple">
                    {
                        (articleClassType && articleClassType.length > 0 ? tagTypeList.filter(tagType => articleClassType.indexOf(tagType.classType) > -1) : []).map(tagType => <Select.Option key={tagType.tagId} value={tagType.tagId}>{tagType.tagName}</Select.Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
        <div style={{textAlign: 'right'}}>
            <Space>
                <Button onClick={handleSubmit} loading={submitLoading}>保存</Button>
                <Button onClick={handleDrawerClose}>取消</Button>
            </Space>
        </div>
    </Drawer>
}

ArticleForm.defaultProps = {
    articleId: ''
}

export default ArticleForm
