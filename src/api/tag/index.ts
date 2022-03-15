import HttpRequest from '@/core/request/http';
import { TagInfo } from './types';

/**
 * @description 标签接口
 */
class TagClass extends HttpRequest {
    /**
     * 获取标签列表
     * @param pagination
     */
    getTagList(pagination: GIPagination) {
        return this.fetchGet({
            url: '/admin/getTagList',
            params: pagination
        });
    }

    /**
     * 新增标签
     * @param tagInfo
     */
    newTag(tagInfo: TagInfo) {
        return this.fetchPost({
            url: '/admin/newTag',
            data: tagInfo
        });
    }

    /**
     * 修改标签
     * @param tagInfo
     */
    updateTag(tagInfo: TagInfo) {
        return this.fetchPost({
            url: '/admin/updateTag',
            data: tagInfo
        });
    }

    /**
     * 删除标签
     * @param tagId
     */
    deleteTag(tagId: string) {
        return this.fetchPost({
            url: '/admin/deleteTag',
            data: { tagId }
        });
    }

    /**
     * 获取标签信息
     * @param tagId
     */
    getTagInfo(tagId: string) {
        return this.fetchGet({
            url: '/admin/getTagInfo',
            params: { tagId }
        });
    }

    /**
     * 获取全部标签
     */
    getAllTag() {
        return this.fetchGet({
            url: '/getAllTag'
        });
    }
}

let instance;

export default (function () {
    if (instance) {
        return instance;
    }
    instance = new TagClass();
    return instance;
})();
