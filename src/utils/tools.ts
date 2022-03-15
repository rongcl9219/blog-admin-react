/**
 * 处理日期
 * @param fmt
 * @param date
 * @param type
 * @returns {string|*}
 */
export const formatDate = (fmt: string, date: any, type = 1) => {
    const dateObj = new Date(date);
    let format: string = fmt;

    if (type === 1) {
        const o: any = {
            'M+': dateObj.getMonth() + 1,
            'd+': dateObj.getDate(),
            'h+': dateObj.getHours(),
            'm+': dateObj.getMinutes(),
            's+': dateObj.getSeconds(),
            'q+': Math.floor((dateObj.getMonth() + 3) / 3),
            S: dateObj.getMilliseconds()
        };

        if (/(y+)/.test(fmt)) {
            format = format.replace(
                RegExp.$1,
                String(dateObj.getFullYear()).substring(4 - RegExp.$1.length)
            );
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substring(String(o[k]).length)
                );
            }
        }
        return format;
    }
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minute = dateObj.getMinutes().toString().padStart(2, '0');
    const second = dateObj.getSeconds().toString().padStart(2, '0');

    return year + '年' + month + '月' + day + '日 ' + hours + ':' + minute + ':' + second;
};

/**
 * 生成uuid
 * @returns {string}
 */
export const getUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;

        const v = c === 'x' ? r : (r & 0x3) | 0x8;

        return v.toString(16).replace('-', '');
    });
};
