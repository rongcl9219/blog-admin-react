import React, {Component} from 'react'
import {connect} from 'react-redux'
import {toggleGlobalLoading} from '@/redux/reducers/common/actions'
import {Space, Table, message, Button, Modal, Form, Input, Select} from 'antd'
import {PlusCircleOutlined, FormOutlined, DeleteOutlined} from '@ant-design/icons'
import {TagApi, ClassApi} from '@/api'
import {TagInfo} from '@/api/tag/types'
import {ClassInfo} from '@/api/class/types'
import {ColumnsType, TablePaginationConfig} from 'antd/lib/table'
import type {FormInstance} from 'antd/es/form'

interface IProps {
    setGlobalLoading: (globalLoading: GIGlobalLoading) => void;
}

interface ITagModal {
    visible: boolean;
    title?: string;
    tagId?: number
}

interface IState {
    pagination: TablePaginationConfig;
    tagList: Array<TagInfo>;
    tableLoading: boolean;
    tagModal: ITagModal;
    classTypeOptions: Array<ClassInfo>;
}

class TagAdmin extends Component<IProps, IState> {
    formRef = React.createRef<FormInstance>()

    columns: ColumnsType<TagInfo> = [
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
            title: <Button type="primary" size="middle"
                onClick={() => this.openTagModal()}><PlusCircleOutlined/>新增</Button>,
            key: 'action',
            fixed: 'right',
            render: (_, {tagId}) => (
                <Space size="small">
                    <a onClick={() => this.openTagModal(tagId)}><FormOutlined/>编辑</a>
                    <a style={{color: 'red'}} onClick={() => this.handleDelete(tagId as number)}><DeleteOutlined/>删除</a>
                </Space>
            )
        }
    ]

    constructor(props: any) {
        super(props)
        this.state = {
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            tagList: [],
            tableLoading: false,
            tagModal: {
                visible: false,
                title: ''
            },
            classTypeOptions: []
        }
    }

    componentDidMount() {
        ClassApi.getAllClass()
            .then((res) => {
                this.setState({
                    classTypeOptions: res.data
                })
            })
            .catch(() => false)
        this.getTagList()
    }

    componentWillUnmount() {
        this.setState = () => false
    }

    getTagList = (page: number = 1): void => {
        const {pagination} = this.state
        this.setState({
            tableLoading: true
        })

        TagApi.getTagList({page: page, pageSize: pagination.pageSize || 10})
            .then((res) => {
                const {data} = res
                this.setState({
                    tagList: data.tagList,
                    pagination: {
                        current: data.pagination.page,
                        total: data.pagination.total
                    }
                })
            })
            .catch(() => {
                message.error('获取失败').then()
            })
            .finally(() => {
                this.setState({
                    tableLoading: false
                })
            })
    }

    handleTableChange = (newPagination: TablePaginationConfig): void => {
        this.getTagList(newPagination.current)
    }

    handleDelete = (tagId: number) => {
        const that = this
        Modal.confirm({
            title: '提示',
            content: '是否删除该标签？',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                TagApi.deleteTag(tagId)
                    .then(() => {
                        message.success('删除成功').then()
                        that.getTagList(1)
                    })
                    .catch(() => {
                        message.error('删除失败').then()
                    })
            }
        })
    }

    openTagModal = (tagId?: number) => {
        if (tagId) {
            TagApi.getTagInfo(tagId).then(res => {
                this.formRef.current?.setFieldsValue({
                    tagName: res.data.tagName,
                    classType: res.data.classType,
                    tagDesc: res.data.tagDesc || ''
                })
            })
        }
        this.setState({
            tagModal: {
                visible: true,
                title: tagId ? '编辑标签信息' : '新增标签信息',
                tagId: tagId
            }
        })
    }

    handleSave = (data: TagInfo): Promise<any> => {
        const {tagModal} = this.state
        if (tagModal.tagId) {
            return TagApi.updateTag({
                ...data,
                tagId: tagModal.tagId
            })
        }
        return TagApi.newTag(data)
    }

    handleSubmit = (): void => {
        const {setGlobalLoading} = this.props
        setGlobalLoading({
            isLoading: true,
            loadingTips: '保存中...'
        })
        this.formRef.current?.validateFields().then((value: TagInfo) => {
            const data: TagInfo = {
                tagName: value.tagName,
                classType: value.classType,
                tagDesc: value.tagDesc || ''
            }
            return this.handleSave(data).then(() => {
                message.success('保存成功').then()
                this.setState({
                    tagModal: {
                        visible: false
                    }
                })
                this.getTagList(1)
            }).catch(() => {
                message.error('保存失败').then()
            })
        }).catch(() => false).finally(() => {
            setGlobalLoading({
                isLoading: false
            })
        })
    }

    render() {
        const {tableLoading, pagination, tagList, tagModal, classTypeOptions} = this.state

        return <div className="tag-page">
            <Table rowKey={record => String(record.tagId)}
                loading={tableLoading}
                columns={this.columns}
                pagination={{...pagination, showTotal: total => `共 ${total} 条`}}
                onChange={this.handleTableChange}
                dataSource={tagList}/>
            <Modal visible={tagModal.visible}
                title={tagModal.title}
                cancelText="取消"
                width={700}
                onCancel={() => {
                    this.setState({
                        tagModal: {visible: false, title: ''}
                    })
                }}
                okText="保存"
                destroyOnClose
                onOk={this.handleSubmit}>
                <Form ref={this.formRef}
                    name="basic"
                    labelCol={{span: 6}}
                    wrapperCol={{span: 14}}
                    autoComplete="off"
                    colon={false}
                    preserve={false}>
                    <Form.Item
                        label="标签名称"
                        name="tagName"
                        hasFeedback
                        validateTrigger={['onBlur']}
                        rules={[{required: true, message: '请输入标签名称'}]}
                    >
                        <Input allowClear placeholder="请输入标签名称"/>
                    </Form.Item>
                    <Form.Item
                        label="所属分类"
                        name="classType"
                        hasFeedback
                        rules={[{required: true, message: '请选择所属分类'}]}
                    >
                        <Select allowClear fieldNames={{value: 'classId', label: 'className'}}
                            options={classTypeOptions} placeholder="请选择所属分类"/>
                    </Form.Item>
                    <Form.Item
                        label="标签描述"
                        name="tagDesc"
                    >
                        <Input placeholder="标签描述"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    }
}

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(TagAdmin)
