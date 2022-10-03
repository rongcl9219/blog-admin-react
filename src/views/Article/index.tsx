import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Select, Card, Button, Pagination } from 'antd';
import NoData from '@/components/NoData';
import ArticleItem from '@/views/Article/ArticleItem';
import ArticleForm from '@/views/Article/ArticleForm';
import { toggleGlobalLoading } from '@/redux/reducers/common/actions';
import { ArticleApi } from '@/api';
import { ArticleList as ArticleQueryIProps, ArticleInfo } from '@/api/article/types';
import './article.less';
import { TagInfo } from '@/api/tag/types';
import { ClassInfo } from '@/api/class/types';

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
    }
}

interface IProps {
    setGlobalLoading: (globalLoading: GIGlobalLoading) => void;
}

class ArticleAdmin extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
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
            articleList: []
        };
    }

    componentDidMount() {
        this.getArticleList();
    }

    getArticleList = () => {
        const { setGlobalLoading } = this.props;
        const { queryInfo } = this.state;
        setGlobalLoading({
            isLoading: true,
            loadingTips: '加载中...'
        });

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
                });
            } else {
                message.error('获取列表失败').then();
            }
        }).catch(error => {
            console.error(error);
            message.error('获取列表失败').then();
        }).finally(() => {
            setGlobalLoading({
                isLoading: false
            });
        });
    };

    handleSelectChange = (value: number) => {
        const { queryInfo } = this.state;
        this.setState({
            queryInfo: {
                ...queryInfo,
                articleStatus: value
            }
        }, () => {
            this.getArticleList();
        });
    };

    handleSizeChange = (page: number) => {
        const {queryInfo} = this.state;
        this.setState({
            queryInfo: {
                ...queryInfo,
                page: page,
                pageSize: 10
            }
        });
    };

    setFormDrawerVisible = (visible: boolean, type?: number, articleId?: string) => {
        this.setState({
            formDrawer: {
                visible: visible,
                type: type || 1,
                articleId: articleId || ''
            }
        });
    };

    render() {
        const { articleList, queryInfo, formDrawer } = this.state;
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
                            articleList.map(article => <ArticleItem setFormDrawerVisible={this.setFormDrawerVisible} getArticleList={this.getArticleList} articleInfo={article} key={article.articleId}/>) :
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
        </div>;
    }
}

export default connect(() => ({}), {
    setGlobalLoading: toggleGlobalLoading
})(ArticleAdmin);
