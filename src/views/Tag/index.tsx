import React, { FC, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toggleGlobalLoading } from '@/redux/reducers/common/actions';
import { Space, Table, message, Button, Modal, Form, Input, Select } from 'antd';
import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { TagApi, ClassApi } from '@/api';
import { TagInfo } from '@/api/tag/types';
import { ClassInfo } from '@/api/class/types';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';

interface IProps {
    setGlobalLoading: (globalLoading: any) => void;
}

interface ITagModal {
    visible: boolean;
    title?: string;
    tagId?: number
}

const TagAdmin: FC<IProps> = ({ setGlobalLoading }) => {
    const [isLoadTag, setLoadTag] = useState<boolean>(false);
    const [tagList, setTagList] = useState<Array<TagInfo>>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [classTypeOptions, setClassTypeOptions] = useState<Array<ClassInfo>>([]);
    const [tagModal, setTagModal] = useState<ITagModal>({
        visible: false,
        title: ''
    });
    const [form] = Form.useForm();
    const {confirm} = Modal;

    const getTagList = useCallback((page: number = 1): void => {
        setTableLoading(true);

        TagApi.getTagList({ page: page, pageSize: pagination.pageSize || 10 })
            .then((res) => {
                const {data} = res;
                setPagination({
                    pageSize: pagination.pageSize,
                    current: data.pagination.page,
                    total: data.pagination.total
                });
                setTagList(data.tagList);
            })
            .catch(() => {
                message.error('获取失败').then();
            })
            .finally(() => {
                setTableLoading(false);
            });
    }, [pagination.pageSize]);

    const handleTableChange = (newPagination: TablePaginationConfig): void => {
        getTagList(newPagination.current);
    };

    const handleDelete = (tagId: number) => {
        confirm({
            title: '提示',
            content: '是否删除该标签？',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                TagApi.deleteTag(tagId)
                    .then(() => {
                        message.success('删除成功').then();
                        getTagList(1);
                    })
                    .catch(() => {
                        message.error('删除失败').then();
                    });
            }
        });
    };

    const openTagModal = (tagId?: number) => {
        if (tagId) {
            TagApi.getTagInfo(tagId).then(res => {
                form.setFieldsValue({
                    tagName: res.data.tagName,
                    classType: res.data.classType,
                    tagDesc: res.data.tagDesc || ''
                });
            });
        }
        setTagModal({
            visible: true,
            title: tagId ? '编辑标签信息' : '新增标签信息',
            tagId: tagId
        });
    };

    const handleSave = (data: TagInfo): Promise<any> => {
        if (tagModal.tagId) {
            return TagApi.updateTag({
                ...data,
                tagId: tagModal.tagId
            });
        }
        return TagApi.newTag(data);
    };

    const handleSubmit = (): void => {
        setGlobalLoading({
            isLoading: true,
            loadingTips: '保存中...'
        });
        form.validateFields().then((value: TagInfo) => {
            const data: TagInfo = {
                tagName: value.tagName,
                classType: value.classType,
                tagDesc: value.tagDesc || ''
            };
            return handleSave(data).then(() => {
                message.success('保存成功').then();
                setTagModal({
                    visible: false
                });
                getTagList(1);
            }).catch(() => {
                message.error('保存失败').then();
            });
        }).catch(() => false).finally(() => {
            setGlobalLoading({
                isLoading: false
            });
        });
    };

    const columns: ColumnsType<TagInfo> = [
        {
            title: '',
            dataIndex: 'index',
            key: 'index',
            align: 'center'
        },
        {
            title: '标签名称',
            dataIndex: 'tagName',
            key: 'tagName'
        },
        {
            title: '所属分类',
            dataIndex: 'className',
            key: 'className'
        },
        {
            title: '标签描述',
            dataIndex: 'tagDesc',
            key: 'tagDesc'
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate'
        },
        {
            title: <Button type="primary" size="middle" onClick={() => openTagModal()}><PlusCircleOutlined />新增</Button>,
            key: 'action',
            fixed: 'right',
            render: (_, { tagId }) => (
                <Space size="small">
                    <a onClick={() => openTagModal(tagId)}><FormOutlined />编辑</a>
                    <a style={{ color: 'red' }} onClick={() => handleDelete(tagId as number)}><DeleteOutlined />删除</a>
                </Space>
            )
        }
    ];

    useEffect(() => {
        ClassApi.getAllClass()
            .then((res) => {
                setClassTypeOptions(res.data);
            })
            .catch(() => false);
    }, []);

    useEffect(() => {
        if (!isLoadTag) {
            getTagList(1);
            setLoadTag(true);
        }
    }, [getTagList, isLoadTag]);

    return <div className="tag-page">
        <Table rowKey={record => String(record.tagId)}
            loading={tableLoading}
            columns={columns}
            pagination={pagination}
            onChange={handleTableChange}
            dataSource={tagList} />
        <Modal visible={tagModal.visible}
            title={tagModal.title}
            cancelText="取消"
            width={700}
            onCancel={() => setTagModal({ visible: false, title: '' })}
            okText="保存"
            destroyOnClose
            onOk={handleSubmit}>
            <Form form={form}
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                autoComplete="off"
                colon={false}
                preserve={false}>
                <Form.Item
                    label="标签名称"
                    name="tagName"
                    hasFeedback
                    validateTrigger={['onBlur']}
                    rules={[{ required: true, message: '请输入标签名称' }]}
                >
                    <Input allowClear placeholder="请输入标签名称" />
                </Form.Item>
                <Form.Item
                    label="所属分类"
                    name="classType"
                    hasFeedback
                    rules={[{ required: true, message: '请选择所属分类' }]}
                >
                    <Select allowClear fieldNames={{ value: 'classId', label: 'className' }} options={classTypeOptions} placeholder="请选择所属分类" />
                </Form.Item>
                <Form.Item
                    label="标签描述"
                    name="tagDesc"
                >
                    <Input placeholder="标签描述" />
                </Form.Item>
            </Form>
        </Modal>
    </div>;
};

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(TagAdmin);
