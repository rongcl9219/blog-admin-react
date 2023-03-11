import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Select, Card, Button, Pagination, Modal, notification } from 'antd'
import NoData from '@/components/NoData'
import ArticleItem from '@/views/Article/ArticleItem'
import ArticleForm from '@/views/Article/ArticleForm'
import { toggleGlobalLoading } from '@/redux/reducers/common/actions'
import { ArticleApi } from '@/api'
import { ArticleList as ArticleQueryIProps, ArticleInfo } from '@/api/article/types'
import './article.less'
import { TagInfo } from '@/api/tag/types'
import { ClassInfo } from '@/api/class/types'
import MdEditor from '@/components/MdEditor'

interface Article extends ArticleInfo {
    articleId: string;
    isPublish: number;
    createUsername: string;
    createDate: string;
    isDelete: number;
    classTypeList: Array<ClassInfo>;
    tagTypeList: Array<TagInfo>;
}

interface IState {
    queryInfo: ArticleQueryIProps;
    articleList: Array<Article>;
    formDrawer: {
        visible: boolean;
        type: number;
        articleId?: string;
    },
    editorModal: {
        visible: boolean;
        articleId: string;
        content: string;
    }
}

interface IProps {
    setGlobalLoading: (globalLoading: GIGlobalLoading) => void;
}

class ArticleAdmin extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            queryInfo: {
                articleStatus: 0,
                page: 1,
                pageSize: 10,
                total: 0
            },
            formDrawer: {
                visible: false,
                type: 1,
                articleId: ''
            },
            articleList: [],
            editorModal: {
                visible: false,
                articleId: '',
                content: ''
            }
        }
    }

    componentDidMount() {
        this.getArticleList()
    }

    getArticleList = () => {
        const { setGlobalLoading } = this.props
        const { queryInfo } = this.state
        setGlobalLoading({
            isLoading: true,
            loadingTips: '加载中...'
        })

        ArticleApi.getArticleList(queryInfo).then(res => {
            if (res.code === 200) {
                this.setState({
                    queryInfo: {
                        ...queryInfo,
                        page: res.data.pagination.page,
                        pageSize: res.data.pagination.pageSize,
                        total: res.data.pagination.total
                    },
                    articleList: res.data.articleList || []
                })
            } else {
                message.error('获取列表失败').then()
            }
        }).catch(error => {
            console.error(error)
            message.error('获取列表失败').then()
        }).finally(() => {
            setGlobalLoading({
                isLoading: false
            })
        })
    }

    handleSelectChange = (value: number) => {
        const { queryInfo } = this.state
        this.setState({
            queryInfo: {
                ...queryInfo,
                articleStatus: value
            }
        }, () => {
            this.getArticleList()
        })
    }

    handleSizeChange = (page: number) => {
        const {queryInfo} = this.state
        this.setState({
            queryInfo: {
                ...queryInfo,
                page: page,
                pageSize: 10
            }
        })
    }

    setFormDrawerVisible = (visible: boolean, type?: number, articleId?: string) => {
        this.setState({
            formDrawer: {
                visible: visible,
                type: type || 1,
                articleId: articleId || ''
            }
        })
    }

    setEditorVisible = (visible: boolean, articleId?: string) => {
        if (visible && articleId) {
            ArticleApi.getContent(articleId)
                .then((res) => {
                    this.setState({
                        editorModal: {
                            visible: visible,
                            articleId: articleId || '',
                            content: res.data.articleContent || ''
                        }
                    })
                })
                .catch(() => {
                    this.setState({
                        editorModal: {
                            visible: visible,
                            articleId: articleId || '',
                            content: ''
                        }
                    })
                    message.error('获取内容失败').then()
                })
        }
    }

    editorCancel = () => {
        this.setState({
            editorModal: {
                visible: false,
                articleId: '',
                content: ''
            }
        })
    }

    editorChange = (content: string) => {
        const { editorModal } = this.state
        this.setState({
            editorModal: {
                ...editorModal,
                content: content
            }
        })
    }

    saveArticleContent = () => {
        const { editorModal } = this.state
        ArticleApi.saveContent(editorModal.articleId, editorModal.content)
            .then(() => {
                notification.success({
                    message: '保存成功',
                    duration: 2
                })
            })
            .catch(() => {
                notification.error({
                    message: '保存失败',
                    duration: 2
                })
            })
    }

    render() {
        const { articleList, queryInfo, formDrawer, editorModal } = this.state
        return <div className="article-page">
            <Card>
                <div className="search-form">
                    <span>文章状态：</span>
                    <Select style={{width: 300}} defaultValue={0} onChange={this.handleSelectChange}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>已发布</Select.Option>
                        <Select.Option value={2}>未发布</Select.Option>
                        <Select.Option value={3}>已删除</Select.Option>
                    </Select>
                    <Button style={{ marginLeft: 10 }} type="primary" onClick={() => this.setFormDrawerVisible(true)}>新增</Button>
                </div>
                <div className="article-wrap">
                    {
                        articleList.length > 0 ?
                            articleList.map(article => <ArticleItem setEditorVisible={this.setEditorVisible} setFormDrawerVisible={this.setFormDrawerVisible} getArticleList={this.getArticleList} articleInfo={article} key={article.articleId}/>) :
                            <NoData/>
                    }
                </div>
                <div style={{textAlign: 'right'}}>
                    <Pagination style={{ display: 'inline-block' }}
                        current={queryInfo.page}
                        pageSize={queryInfo.pageSize}
                        total={queryInfo.total}
                        onChange={this.handleSizeChange}
                        showTotal={total => `共 ${total} 条`} />
                </div>
            </Card>
            <ArticleForm getArticleList={this.getArticleList} visible={formDrawer.visible} articleId={formDrawer.articleId} setVisible={this.setFormDrawerVisible} type={formDrawer.type} />
            <Modal visible={editorModal.visible}
                onCancel={this.editorCancel}
                onOk={this.saveArticleContent}
                wrapClassName="markdown-content"
                closable={false}
                style={{ height: '100%', top: 16, padding: 0, maxHeight: 'calc(100vh - 32px)' }}
                bodyStyle={{height: 'calc(100vh - 85px)'}}
                keyboard={false}
                maskClosable={false}
                width="100%">
                <MdEditor content={editorModal.content} onChange={this.editorChange} onSave={this.saveArticleContent} />
            </Modal>
        </div>
    }
}

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(ArticleAdmin)
