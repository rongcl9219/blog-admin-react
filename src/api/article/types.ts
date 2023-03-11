/**
 * 文章列表接口参数
 */
export interface ArticleList extends GIPagination {
    query?: string;
    classType?: string;
    tagType?: string;
    articleStatus?: number;
}

/**
 * 文章信息接口参数
 */
export interface ArticleInfo {
    articleId?: string;
    articleTitle: string;
    articleSubtitle?: string;
    articleKeyword: string;
    articleInfo: string;
    articleCover?: string;
    classType: string | number[];
    tagType: string | number[];
    articleCoverInfo?: Array<GIFileInfo>;
}
