import HttpRequest from '@/core/request/http';
import { ArticleList, ArticleInfo } from './types';

/**
 * @description 文章列表接口
 */
class ArticleApi extends HttpRequest {
    /**
     * 获取文章列表
     * @param queryParams
     */
    getArticleList(queryParams: ArticleList) {
        return this.fetchGet({
            url: '/getArticleList',
            params: queryParams
        });
    }

    /**
     * 获取文章信息
     * @param articleId
     */
    getArticleInfo(articleId: string) {
        return this.fetchGet({
            url: '/getArticleInfo',
            params: { articleId }
        });
    }

    /**
     * 获取文章内容
     * @param articleId
     */
    getContent(articleId: string) {
        return this.fetchGet({
            url: '/getContent',
            params: { articleId }
        });
    }

    /**
     * 新增文章
     * @param articleInfo
     */
    newArticle(articleInfo: ArticleInfo) {
        return this.fetchPost({
            url: '/admin/newArticle',
            data: articleInfo
        });
    }

    /**
     * 编辑文章基础信息
     * @param articleInfo
     */
    editArticle(articleInfo: ArticleInfo) {
        return this.fetchPost({
            url: '/admin/editArticle',
            data: articleInfo
        });
    }

    /**
     * articledContent
     * @param articleId
     * @param articledContent
     */
    saveContent(articleId: string, articledContent: string) {
        return this.fetchPost({
            url: '/admin/saveContent',
            data: { articleId, articledContent }
        });
    }

    /**
     * 删除文章
     * @param articleId
     */
    deleteArticle(articleId: string) {
        return this.fetchGet({
            url: '/admin/deleteArticle',
            params: { articleId }
        });
    }

    /**
     * 恢复文章
     * @param articleId
     */
    recoverArticle(articleId: string) {
        return this.fetchGet({
            url: '/admin/recoverArticle',
            params: { articleId }
        });
    }

    /**
     * 修改文章发布状态
     * @param articleId
     * @param isPublish
     */
    updatePublish(articleId: string, isPublish: number) {
        return this.fetchGet({
            url: '/admin/updatePublish',
            params: { articleId, isPublish }
        });
    }

    /**
     * 获取最近发布文章
     */
    getCurrentArticles() {
        return this.fetchGet({
            url: '/admin/getCurrentArticles'
        });
    }
}

let instance;

export default (function () {
    if (instance) {
        return instance;
    }
    instance = new ArticleApi();
    return instance;
})();
