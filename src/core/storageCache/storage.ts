import Cache from 'web-storage-cache';

const lsCache = new Cache();
const ssCache = new Cache({ storage: 'sessionStorage' });

/**
 * 本地存储类
 */
class StorageCache {
    protected key: string;
    protected exp: number;
    protected storage: any;

    constructor(key: string, exp: number = 0, type: string = 'localStorage') {
        this.key = key;
        this.exp = exp;
        this.storage = type === 'localStorage' ? lsCache : ssCache;
    }

    /**
     * 保存
     * @param value
     */
    save(value: any) {
        const options = this.exp ? { exp: this.exp } : null;

        this.storage.set(this.key, value, options);
    }

    /**
     * 获取值
     */
    load() {
        return this.storage.get(this.key);
    }

    /**
     * 删除
     */
    delete() {
        this.storage.delete(this.key);
    }
}

export default StorageCache;
