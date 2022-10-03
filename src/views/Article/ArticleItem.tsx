import React, { FC } from 'react';
import { Tooltip, Tag, Button, Popover, message } from 'antd';
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
}

const ArticleItem: FC<IProps> = ({articleInfo, getArticleList, setFormDrawerVisible}) => {
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
                            <Button type="link">恢复删除</Button> :
                            articleInfo.isPublish === 1 ? null :
                                <><Button type="link" onClick={() => setFormDrawerVisible(true, 2, articleInfo.articleId)}>编辑信息</Button>
                                    <Button type="link">编辑文章</Button>
                                    <Popover content={<Button type="primary" size="small" danger>删除</Button>}>
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
