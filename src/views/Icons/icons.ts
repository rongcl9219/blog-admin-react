const reqIcons = require.context('@/svg/icons', false, /\.svg$/);

const iconList: string[] = reqIcons.keys().map(key => reqIcons(key).default.id);

export default iconList;
