const KEYS: GIObject = {
    refreshToken: 'rk',
    tokenExp: 'exp',
    theme: 'adminTheme'
}
const NameSpace = 'MY_BLOG'

Object.keys(KEYS).forEach((key: string) => {
    if (Object.prototype.hasOwnProperty.call(KEYS, key)) {
        KEYS[key] = `${NameSpace}:${key}`.toUpperCase()
    }
})

export default KEYS
