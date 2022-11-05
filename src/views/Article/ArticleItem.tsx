import React, { FC } from 'react';
import { Tooltip, Tag, Button, Popover, message, Modal } from 'antd';
import { TagsFilled, MoreOutlined } from '@ant-design/icons';
import { ArticleInfo } from '@/api/article/types';
import { TagInfo } from '@/api/tag/types';
import { ClassInfo } from '@/api/class/types';
import { ArticleApi } from '@/api';
import './articleItem.less';

interface Article extends ArticleInfo {
    articleId: string;
    isPublish: number;
    createUsername: string;
    createDate: string;
    isDelete: number;
    classTypeList: Array<ClassInfo>;
    tagTypeList: Array<TagInfo>;
}

interface IProps {
    articleInfo: Article;
    getArticleList: () => void;
    setFormDrawerVisible: (visible: boolean, type?: number, articleId?: string) => void;
    setEditorVisible: (visible: boolean, article?: string) => void;
}

const ArticleItem: FC<IProps> = ({articleInfo, getArticleList, setFormDrawerVisible, setEditorVisible}) => {
    const updateArticlePublish = () => {
        const tip = articleInfo.isPublish === 0 ? '发布' : '取消发布';
        ArticleApi.updatePublish(articleInfo.articleId, articleInfo.isPublish)
            .then(() => {
                message.success(`${tip}成功`).then();
                getArticleList();
            })
            .catch(() => {
                message.error(`${tip}失败`).then();
            });
    };

    const handleDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '确定删除该文章？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                ArticleApi.deleteArticle(articleInfo.articleId)
                    .then(() => {
                        message.success('删除成功').then();
                        getArticleList();
                    })
                    .catch(() => {
                        message.error('删除失败').then();
                    });
            }
        });
    };

    const reversalArticle = () => {
        ArticleApi.recoverArticle(articleInfo.articleId)
            .then(() => {
                message.success('恢复成功').then();
                getArticleList();
            })
            .catch(() => {
                message.error('恢复失败').then();
            });
    };

    return <div className="article-item">
        <div className="article-item-con">
            <div className="article-item-left">
                <p className="article-title">
                    {articleInfo.articleTitle}
                    <Tooltip placement="right" title={articleInfo.isPublish === 0 ? '未发布' : '已发布'} color={articleInfo.isPublish === 0 ? '#E6A23C' : '#67C23A'}>
                        <span onClick={updateArticlePublish} style={{marginLeft: 10, fontSize: 20, cursor: 'pointer', color: articleInfo.isPublish === 0 ? '#E6A23C' : '#67C23A'}}><TagsFilled /></span>
                    </Tooltip>
                </p>
                <p className="article-keyword">{ articleInfo.articleKeyword }</p>
                <p className="article-info">{ articleInfo.articleInfo }</p>
                <p className="article-type">
                    {
                        articleInfo.classTypeList.map(classType => <Tag color="processing" key={classType.classId}>{classType.className}</Tag>)
                    }
                </p>
                <p className="article-type">
                    {
                        articleInfo.tagTypeList.map(tagType => <Tag color="success" key={tagType.tagId}>{tagType.tagName}</Tag>)
                    }
                </p>
            </div>
            <div className="article-item-right">
                <p className="article-time">{articleInfo.createDate}</p>
                <div className="article-cover">
                    <img src={articleInfo.articleCover} alt="" />
                </div>
                <div className="item-info-opt">
                    {
                        articleInfo.isDelete === 1 ?
                            <Button type="link" onClick={reversalArticle}>恢复删除</Button> :
                            articleInfo.isPublish === 1 ? null :
                                <><Button type="link" onClick={() => setFormDrawerVisible(true, 2, articleInfo.articleId)}>编辑信息</Button>
                                    <Button type="link" onClick={() => setEditorVisible(true, articleInfo.articleId) }>编辑文章</Button>
                                    <Popover content={<Button type="primary" size="small" danger onClick={handleDelete}>删除</Button>}>
                                        <MoreOutlined />
                                    </Popover>
                                </>
                    }
                </div>
            </div>
        </div>
    </div>;
};

export default ArticleItem;
