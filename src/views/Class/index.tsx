import React, { FC, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { toggleGlobalLoading } from '@/redux/reducers/common/actions'
import { Space, Table, message, Button, Modal, Form, Input, Select } from 'antd'
import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import { ClassApi } from '@/api'
import { ClassInfo } from '@/api/class/types'

interface IClassTypeItem {
    value: number;
    label: string;
}

interface IClassModal {
    visible: boolean;
    title: string;
    classId?: number
}

interface IProps {
    setGlobalLoading: (globalLoading: any) => void;
}

const ClassAdmin: FC<IProps> = ({ setGlobalLoading }) => {
    const [isLoadClass, setLoadClass] = useState<boolean>(false)
    const [isMounted, setIsMounted] = useState<boolean>(true)
    const [classList, setClassList] = useState<Array<ClassInfo>>([])
    const [tableLoading, setTableLoading] = useState<boolean>(false)
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0
    })
    const [classModal, setClassModal] = useState<IClassModal>({
        visible: false,
        title: ''
    })
    const {confirm} = Modal
    const [form] = Form.useForm()

    const getClassData = useCallback((page: number = 1): void => {
        setTableLoading(true)
        ClassApi.getClassList({
            page: page,
            pageSize: pagination.pageSize || 10
        })
            .then((res) => {
                const {data} = res
                setClassList(data.classList)
                setPagination({
                    pageSize: pagination.pageSize,
                    current: data.pagination.page,
                    total: data.pagination.total
                })
            })
            .catch(() => {
                message.error('获取失败').then()
            }).finally(() => {
                setTimeout(() => {
                    setTableLoading(false)
                }, 300)
            })
    }, [pagination.pageSize])

    const handleTableChange = (newPagination: TablePaginationConfig): void => {
        getClassData(newPagination.current)
    }

    const handleDelete = (classId: number) => {
        confirm({
            title: '提示',
            content: '是否删除该分类？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                ClassApi.deleteClass(classId)
                    .then(() => {
                        message.success('删除成功').then()
                        getClassData(1)
                    })
                    .catch(() => {
                        message.error('删除失败').then()
                    })
            }
        })
    }

    const openClassModal = (classId?: number) => {
        if (classId) {
            ClassApi.getClassInfo(classId).then(res => {
                form.setFieldsValue({
                    className: res.data.className,
                    classCode: res.data.classCode,
                    classType: res.data.classType,
                    classDesc: res.data.classDesc || ''
                })
            })
        }
        setClassModal({
            visible: true,
            title: classId ? '编辑分类信息' : '新增分类信息',
            classId: classId
        })
    }

    const checkClassCode: RuleValidator<string> = (rule, value): Promise<void> => new Promise((resolve, reject) => {
        if (!value || value.trim() === '') {
            reject(new Error('请输入分类编号'))
        } else if (!/^[A-Z]([_A-Z]{1,19})$/.test(value)) {
            // 正则以大写字母开始，可以包含大写字母和_组成的2-20个字符
            reject(new Error('分类编号必须是以大写字母开始，可以包含大写字母和_组成的2-20个字符'))
        } else {
            resolve()
        }
    })

    const handleSave = (data: ClassInfo): Promise<any> => {
        if (classModal.classId) {
            return ClassApi.updateClass({
                ...data,
                classId: classModal.classId
            })
        }
        return ClassApi.newClass(data)
    }

    const handleSubmit = ():void => {
        setGlobalLoading({
            isLoading: true,
            loadingTips: '保存中...'
        })
        form.validateFields().then((value: ClassInfo) => {
            const data: ClassInfo = {
                className: value.className,
                classCode: value.classCode,
                classType: value.classType,
                classDesc: value.classDesc || ''
            }
            return handleSave(data).then(() => {
                message.success('保存成功').then()
                setClassModal({
                    visible: false,
                    title: ''
                })
                getClassData(1)
            }).catch(() => {
                message.error('保存失败').then()
            })
        }).catch(() => false).finally(() => {
            setGlobalLoading({
                isLoading: false
            })
        })
    }

    const columns: ColumnsType<ClassInfo> = [
        {
            title: '',
            dataIndex: 'index',
            key: 'index',
            align: 'center'
        },
        {
            title: '分类名称',
            dataIndex: 'className',
            key: 'className'
        },
        {
            title: '分类编号',
            dataIndex: 'classCode',
            key: 'classCode'
        },
        {
            title: '分类类型',
            dataIndex: 'classType',
            key: 'classType',
            render: (_, { classType }) => {
                let classTypeStr = ''
                if (classType === 0) {
                    classTypeStr = '默认分类'
                } else if (classType === 1) {
                    classTypeStr = '编程语言'
                } else if (classType === 2) {
                    classTypeStr = '开发工具'
                } else if (classType === 3) {
                    classTypeStr = '其他技能'
                }
                return classTypeStr
            }
        },
        {
            title: '分类描述',
            key: 'classDesc',
            dataIndex: 'classDesc'
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate'
        },
        {
            title: <Button type="primary" size="middle" onClick={() => openClassModal()}><PlusCircleOutlined />新增</Button>,
            key: 'action',
            fixed: 'right',
            render: (_, { classId }) => (
                <Space size="small">
                    <a onClick={() => openClassModal(classId)}><FormOutlined />编辑</a>
                    <a style={{ color: 'red' }} onClick={() => handleDelete(classId as number)}><DeleteOutlined />删除</a>
                </Space>
            )
        }
    ]

    const classTypeOptions: Array<IClassTypeItem> = [
        { value: 0, label: '默认分类' },
        { value: 1, label: '编程语言' },
        { value: 2, label: '开发工具' },
        { value: 3, label: '其他技能' }
    ]

    useEffect(() => {
        if (!isLoadClass) {
            getClassData(1)
            if (isMounted) {
                setLoadClass(true)
            }
        }
        return () => setIsMounted(false)
    }, [getClassData, isLoadClass, isMounted])

    return <div className="class-page">
        <Table rowKey={record => String(record.classId)}
            loading={tableLoading}
            columns={columns}
            pagination={{ ...pagination, showTotal: total => `共 ${total} 条` }}
            onChange={handleTableChange}
            dataSource={classList} />
        <Modal visible={classModal.visible}
            title={classModal.title}
            cancelText="取消"
            width={700}
            onCancel={() => setClassModal({ visible: false, title: '' })}
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
                    label="分类名称"
                    name="className"
                    hasFeedback
                    validateTrigger={['onBlur']}
                    rules={[{ required: true, message: '请输入分类名称' }]}
                >
                    <Input allowClear placeholder="请输入分类名称" />
                </Form.Item>
                <Form.Item
                    label="分类编号"
                    name="classCode"
                    hasFeedback
                    validateTrigger={['onBlur']}
                    rules={[{ required: true, validator: checkClassCode }]}
                >
                    <Input allowClear placeholder="请输入分类编号" />
                </Form.Item>
                <Form.Item
                    label="分类类型"
                    name="classType"
                    hasFeedback
                    rules={[{ required: true, message: '请选择分类类型' }]}
                >
                    <Select allowClear options={classTypeOptions} placeholder="请选择分类类型" />
                </Form.Item>
                <Form.Item
                    label="分类描述"
                    name="classDesc"
                >
                    <Input placeholder="分类描述" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
}

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(ClassAdmin)
