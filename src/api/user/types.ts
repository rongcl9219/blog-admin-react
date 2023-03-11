/**
 * 用户信息接口参数
 */
export interface UserInfo {
    userId?: string;
    avatar?: string;
    signature?: string;
    email?: string;
}

/**
 * 修改密码接口参数
 */
export interface UpdatePass {
    oldPass: string;
    newPass: string;
    checkPass: string;
}
