import Cookies from 'js-cookie'

interface IOptions {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
}

class CookieCache {
    protected key: string

    protected options: IOptions = {
        path: '',
        domain: '',
        secure: false
    }

    constructor(key: string, options?: IOptions) {
        this.key = key
        this.options = Object.assign(this.options, options || {})
    }

    /**
     * 保存
     * @param value
     */
    save(value: any) {
        Cookies.set(this.key, value, this.options)
    }

    /**
     * 获取值
     */
    load() {
        return Cookies.get(this.key)
    }

    /**
     * 删除
     */
    delete() {
        Cookies.remove(this.key)
    }
}

export default CookieCache
