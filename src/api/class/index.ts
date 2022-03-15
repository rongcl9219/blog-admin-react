import HttpRequest from '@/core/request/http';
import { ClassInfo } from './types';

/**
 * @description 分类接口
 */
class ClassApi extends HttpRequest {
    /**
     * 获取分类列表
     * @param pagination
     */
    getClassList(pagination: GIPagination) {
        return this.fetchGet({
            url: '/admin/getClassList',
            params: pagination
        });
    }

    /**
     * 新增分类
     * @param classInfo
     */
    newClass(classInfo: ClassInfo) {
        return this.fetchPost({
            url: '/admin/newClass',
            data: classInfo
        });
    }

    /**
     * 修改分类
     * @param classInfo
     */
    updateClass(classInfo: ClassInfo) {
        return this.fetchPost({
            url: '/admin/updateClass',
            data: classInfo
        });
    }

    /**
     * 删除分类
     * @param classId
     */
    deleteClass(classId: string) {
        return this.fetchPost({
            url: '/admin/deleteClass',
            data: { classId }
        });
    }

    /**
     * 获取分类信息
     * @param classId
     */
    getClassInfo(classId: string) {
        return this.fetchGet({
            url: '/admin/getClassInfo',
            params: { classId }
        });
    }

    /**
     * 获取全部分类
     */
    getAllClass() {
        return this.fetchGet({
            url: '/getAllClass'
        });
    }

    /**
     * 获取分类
     */
    getClass() {
        return this.fetchGet({
            url: '/getClass'
        });
    }
}

let instance;

export default (function () {
    if (instance) {
        return instance;
    }
    instance = new ClassApi();
    return instance;
})();
